/**
 * Base de Conocimiento Semilla (Points para Qdrant - src/data/knowledge.seed.js)
 * ------------------------------------------------------------------------------
 * Cada elemento representa un Point en nuestra colección 'campuslands_ia'.
 * Al inicializar el servidor, cada texto pasa por el Modelo de Embeddings de IA
 * (generarEmbeddingIA) para calcular su vector de 8 dimensiones y almacenarlo
 * junto a su Payload JSON.
 */

import { generarEmbeddingIA } from "../ai/embeddingsModel.js";

const DOCUMENTOS_BASE = [
  {
    id: 101,
    titulo: "Qdrant: Motor de Búsqueda Vectorial con Grafos HNSW",
    categoria: "Bases de Datos Vectoriales",
    autor: "Equipo Qdrant",
    descripcion:
      "Base de datos vectorial open-source que indexa embeddings de alta dimensionalidad usando grafos HNSW y compresión Product Quantization para búsquedas ultrarrápidas en memoria RAM o Memmap."
  },
  {
    id: 102,
    titulo: "Modelos de Embeddings e Inteligencia Artificial Semántica",
    categoria: "Inteligencia Artificial",
    autor: "Campuslands AI Lab",
    descripcion:
      "Las redes neuronales transforman texto en lenguaje natural, imágenes y audio en vectores numéricos (embeddings) para construir chatbots con RAG y asistentes conversacionales inteligentes."
  },
  {
    id: 103,
    titulo: "Métricas de Distancia: Cosine Similarity, Euclidean y Dot Product",
    categoria: "Matemáticas & Algoritmos",
    autor: "Campuslands AI Lab",
    descripcion:
      "Criterios matemáticos definidos al crear una colección en Qdrant para medir la similitud y proximidad entre vectores de consulta y puntos almacenados en el espacio multidimensional."
  },
  {
    id: 104,
    titulo: "Desarrollo Backend con Node.js, Express y APIs REST",
    categoria: "Backend",
    autor: "Campuslands Backend",
    descripcion:
      "Construcción de servidores HTTP en JavaScript con ECMAScript Modules, enrutadores modulares y conexión de clientes SDK hacia motores de bases de datos."
  },
  {
    id: 105,
    titulo: "Seguridad en APIs con express-rate-limit contra Ataques DoS",
    categoria: "Ciberseguridad",
    autor: "Campuslands Security",
    descripcion:
      "Middleware de protección que limita el tráfico de peticiones por dirección IP y devuelve el código HTTP 429 cuando se agotan los tokens disponibles."
  },
  {
    id: 106,
    titulo: "The Legend of Zelda y Elden Ring: Mundos Abiertos RPG",
    categoria: "Videojuegos",
    autor: "Campuslands Gaming Club",
    descripcion:
      "Videojuegos de aventura y acción RPG en consolas Nintendo Switch, PS5 y PC donde el jugador explora grandes mapas con espadas y misiones épicas."
  }
];

/**
 * Construye los Points completos { id, vector, payload } listos para insertar en Qdrant
 */
export function obtenerPuntosSemilla() {
  return DOCUMENTOS_BASE.map((doc) => {
    const textoCompleto = `${doc.titulo}. ${doc.categoria}. ${doc.descripcion}`;
    return {
      id: doc.id,
      vector: generarEmbeddingIA(textoCompleto),
      payload: {
        titulo: doc.titulo,
        categoria: doc.categoria,
        autor: doc.autor,
        descripcion: doc.descripcion
      }
    };
  });
}
