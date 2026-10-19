import { Router } from "express";
import { qdrantServer } from "../engine/qdrantEngine.js";
import { generarEmbeddingIA, DIMENSIONES_SEMANTICAS } from "../ai/embeddingsModel.js";

/**
 * Enrutador REST de Base de Datos Vectorial e IA (src/routes/vector.routes.js)
 * ----------------------------------------------------------------------------
 * Replica la experiencia de trabajar con Qdrant y un modelo de Embeddings de IA:
 * 1. Consultar colecciones y sus puntos (Points: id + vector + payload).
 * 2. Crear nuevas colecciones definiendo dimensión, métrica de distancia y storage.
 * 3. Insertar (Upsert) nuevos documentos generando su vector automáticamente con IA.
 * 4. Ejecutar Búsqueda Semántica por Similitud (Similarity Search) + Respuesta RAG.
 */
const router = Router();

/**
 * 1. [GET] /api/collections
 * Lista todas las colecciones vectoriales registradas en el servidor.
 */
router.get("/collections", (req, res) => {
  res.status(200).json({
    exito: true,
    dimensionesSemanticas: DIMENSIONES_SEMANTICAS,
    colecciones: qdrantServer.listCollections()
  });
});

/**
 * 2. [GET] /api/collections/:name
 * Inspecciona una colección específica, su configuración HNSW y todos sus Points.
 */
router.get("/collections/:name", (req, res) => {
  const col = qdrantServer.getCollection(req.params.name);
  if (!col) {
    return res.status(404).json({
      exito: false,
      error: `La colección '${req.params.name}' no existe en Qdrant.`
    });
  }

  res.status(200).json({
    exito: true,
    coleccion: col.getInfo()
  });
});

/**
 * 3. [POST] /api/collections
 * Crea una nueva colección vectorial con su métrica de distancia y modo de storage.
 */
router.post("/collections", (req, res) => {
  const { name, size = 8, distance = "Cosine", storage = "in-memory" } = req.body || {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      exito: false,
      error: "El nombre de la colección ('name') es obligatorio."
    });
  }

  const nueva = qdrantServer.createCollection(name.trim(), {
    size: Number(size),
    distance,
    storage
  });

  res.status(201).json({
    exito: true,
    mensaje: `Colección '${nueva.name}' creada con métrica ${nueva.distance} y almacenamiento ${nueva.storage}.`,
    coleccion: nueva.getInfo()
  });
});

/**
 * 4. [PUT] /api/collections/:name/points
 * Inserta o actualiza un Point en la colección.
 * Si no se envía un vector manual, el Modelo de Embeddings de IA lo calcula
 * automáticamente a partir del texto del payload (titulo + descripcion).
 */
router.put("/collections/:name/points", (req, res) => {
  const col = qdrantServer.getCollection(req.params.name);
  if (!col) {
    return res.status(404).json({
      exito: false,
      error: `La colección '${req.params.name}' no existe.`
    });
  }

  const { id, titulo, categoria = "General", descripcion = "", vector } = req.body || {};

  if (!id || (!titulo && !Array.isArray(vector))) {
    return res.status(400).json({
      exito: false,
      error: "Debes proporcionar un 'id' y un 'titulo'/'descripcion' (o un 'vector' numérico)."
    });
  }

  const textoParaEmbedding = `${titulo || ""}. ${categoria}. ${descripcion}`;
  const vectorFinal = Array.isArray(vector) ? vector : generarEmbeddingIA(textoParaEmbedding);

  try {
    const resultado = col.upsert({
      id: Number(id) || id,
      vector: vectorFinal,
      payload: {
        titulo: titulo || `Punto #${id}`,
        categoria,
        descripcion
      }
    });

    res.status(200).json({
      exito: true,
      mensaje: "Point indexado exitosamente en la colección vectorial.",
      operacion: resultado,
      pointGuardado: {
        id: Number(id) || id,
        vector: vectorFinal,
        payload: { titulo, categoria, descripcion }
      }
    });
  } catch (err) {
    res.status(400).json({
      exito: false,
      error: err.message
    });
  }
});

/**
 * 5. [POST] /api/collections/:name/search
 * Búsqueda Semántica con IA (Similarity Search):
 * 1. Convierte la consulta del usuario ('query') en un vector de embedding con IA.
 * 2. Compara contra todos los Points de la colección usando Cosine, Euclidean o Dot.
 * 3. Retorna los puntos más similares semánticamente + Síntesis RAG.
 */
router.post("/collections/:name/search", (req, res) => {
  const col = qdrantServer.getCollection(req.params.name);
  if (!col) {
    return res.status(404).json({
      exito: false,
      error: `La colección '${req.params.name}' no existe.`
    });
  }

  const { query, limit = 3, distance, category } = req.body || {};

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      exito: false,
      error: "Debes enviar una consulta en lenguaje natural en el campo 'query'."
    });
  }

  // Permitir cambiar dinámicamente la métrica para fines didácticos
  if (distance && ["Cosine", "Euclidean", "Dot"].includes(distance)) {
    col.distance = distance;
  }

  // Paso 1: El Modelo de Embeddings traduce la consulta en un vector de 8 dimensiones
  const queryVector = generarEmbeddingIA(query);

  // Paso 2: Qdrant busca los vectores más cercanos en el espacio multidimensional
  const resultados = col.search(queryVector, {
    limit: Number(limit),
    category: category || null
  });

  const mejorMatch = resultados[0] || null;
  const respuestaIA = mejorMatch
    ? `🤖 [Asistente IA con RAG]: Según tu consulta ("${query}"), el concepto más cercano en el espacio vectorial es "${mejorMatch.payload.titulo}" (Similitud ${col.distance}: ${mejorMatch.score}). Contexto recuperado: ${mejorMatch.payload.descripcion}`
    : "No se encontraron puntos que coincidan con el filtro indicado.";

  res.status(200).json({
    exito: true,
    consultaOriginal: query,
    metricaUtilizada: col.distance,
    vectorConsultaGeneradoPorIA: queryVector,
    dimensionesSignificado: DIMENSIONES_SEMANTICAS,
    respuestaRAG: respuestaIA,
    resultadosSimilitud: resultados
  });
});

export default router;
