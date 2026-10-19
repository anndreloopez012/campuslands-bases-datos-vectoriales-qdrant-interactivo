/**
 * Ejemplo de Cliente Oficial de Qdrant en Producción (examples/qdrant-sdk-real.js)
 * --------------------------------------------------------------------------------
 * Este archivo muestra cómo conectarse a un servidor real de Qdrant levantado con Docker:
 *   docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
 *
 * Utilizando la API REST estándar de Qdrant desde Node.js (Clients - Sección 1.5).
 */

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const COLLECTION_NAME = "campuslands_conocimiento";

export async function demoQdrantReal() {
  console.log(`🔌 Conectando al motor Qdrant en ${QDRANT_URL}...`);

  // 1. Crear una Colección (Collection) con métrica Cosine y dimensión 4
  await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vectors: {
        size: 4,
        distance: "Cosine" // 'Cosine' | 'Euclid' | 'Dot'
      }
    })
  });

  // 2. Insertar Puntos (Points: id + vector + payload JSON)
  await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points?wait=true`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      points: [
        {
          id: 1,
          vector: [0.91, 0.82, 0.12, 0.05],
          payload: {
            titulo: "Curso de Node.js y Express",
            categoria: "Backend",
            nivel: "Intermedio"
          }
        },
        {
          id: 2,
          vector: [0.11, 0.19, 0.95, 0.88],
          payload: {
            titulo: "Bases de Datos Vectoriales con Qdrant e IA",
            categoria: "Inteligencia Artificial",
            nivel: "Avanzado"
          }
        }
      ]
    })
  });

  // 3. Búsqueda Semántica por Similitud (Similarity Search)
  const respuestaBusqueda = await fetch(
    `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vector: [0.15, 0.22, 0.92, 0.85], // Vector generado por el modelo de Embeddings para la consulta del usuario
        limit: 2,
        with_payload: true
      })
    }
  );

  const resultado = await respuestaBusqueda.json();
  console.log("🎯 Resultados más cercanos en Qdrant:", resultado);
}
