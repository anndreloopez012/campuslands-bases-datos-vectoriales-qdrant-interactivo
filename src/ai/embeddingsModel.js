/**
 * Modelo Generador de Embeddings con IA (src/ai/embeddingsModel.js)
 * -----------------------------------------------------------------
 * Tal como explica la Sección 1.3 de la clase, antes de guardar o buscar
 * en una base de datos vectorial (como Qdrant), un Modelo de Embeddings
 * traduce el texto en lenguaje natural a un vector numérico multidimensional
 * que captura su significado semántico.
 *
 * Dimensiones Semánticas del Vector (8 Dimensiones):
 * [0] IA, Redes Neuronales & LLMs (embeddings, lenguaje natural, RAG, chatbots)
 * [1] Backend, Node.js & Clientes SDK (Express, APIs REST, JavaScript, HTTP)
 * [2] Multimodalidad & Visión (imágenes, crayones, colores, audio, video)
 * [3] Motor Qdrant, Indexación HNSW & Storage (colecciones, puntos, RAM, memmap, cuantización)
 * [4] Ciberseguridad & Control de Tráfico (rate limit, DoS, IP, 429, protección)
 * [5] Videojuegos & Entretenimiento (RPG, aventura, consolas, Zelda, Elden Ring)
 * [6] Métricas de Distancia & Geometría (coseno, euclidiana, producto punto, plano 2D)
 * [7] Escalabilidad & Cloud (Docker, contenedores, billones, clúster, producción)
 */

export const DIMENSIONES_SEMANTICAS = [
  "IA & Lenguaje Natural",
  "Backend & Clientes SDK",
  "Multimodalidad & Colores",
  "Qdrant, HNSW & Storage",
  "Ciberseguridad & Rate Limit",
  "Videojuegos & Gaming",
  "Métricas de Distancia",
  "Cloud & Escalabilidad"
];

const DICCIONARIO_SEMANTICO = [
  // Dim 0: IA, Redes Neuronales & LLMs
  ["ia", "inteligencia", "artificial", "embedding", "embeddings", "llm", "chatgpt", "openai", "gemini", "semantica", "semantico", "significado", "lenguaje", "natural", "asistente", "conversacional", "chatbot", "rag", "neuronal", "redes", "neuronales"],
  // Dim 1: Backend, Node.js & Clientes SDK
  ["backend", "node", "nodejs", "express", "api", "rest", "servidor", "endpoint", "enrutador", "http", "json", "javascript", "typescript", "cliente", "clientes", "sdk"],
  // Dim 2: Multimodalidad & Visión
  ["imagen", "imagenes", "audio", "video", "color", "colores", "crayon", "crayones", "azul", "marron", "blanco", "negro", "visual", "multimodal"],
  // Dim 3: Motor Qdrant, Indexación HNSW & Storage
  ["qdrant", "hnsw", "grafo", "grafos", "cuantizacion", "quantization", "hashing", "bucket", "storage", "memoria", "ram", "memmap", "disco", "indexar", "indexacion", "motor", "vectorial"],
  // Dim 4: Ciberseguridad & Control de Tráfico
  ["seguridad", "ciberseguridad", "proteger", "proteccion", "ratelimit", "limit", "dos", "ataque", "denegacion", "ip", "429", "bloqueo", "tokens", "trafico"],
  // Dim 5: Videojuegos & Entretenimiento
  ["videojuego", "videojuegos", "juego", "juegos", "zelda", "elden", "ring", "rpg", "aventura", "consola", "consolas", "switch", "ps5", "gamer", "jugador", "espada", "espadas", "mundo", "abierto"],
  // Dim 6: Métricas de Distancia & Geometría
  ["metrica", "metricas", "distancia", "coseno", "cosine", "euclidiana", "euclidean", "dot", "producto", "proximidad", "cercano", "criterio", "plano", "grid", "knn", "faiss"],
  // Dim 7: Escalabilidad & Cloud
  ["escalabilidad", "escalar", "billones", "millones", "volumen", "docker", "contenedor", "contenedores", "produccion", "cluster", "nube", "velocidad"]
];

function limpiarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

/**
 * Genera un vector de embedding normalizado de 8 dimensiones a partir de cualquier texto.
 */
export function generarEmbeddingIA(texto) {
  const limpio = limpiarTexto(texto);
  const palabras = limpio.split(/\s+/).filter(Boolean);
  const vectorBruto = new Array(8).fill(0.05);

  for (const palabra of palabras) {
    DICCIONARIO_SEMANTICO.forEach((listaClaves, dimIndex) => {
      for (const clave of listaClaves) {
        if (palabra === clave) {
          vectorBruto[dimIndex] += 1.2;
        } else if (palabra.length >= 4 && (palabra.includes(clave) || clave.includes(palabra))) {
          vectorBruto[dimIndex] += 0.45;
        }
      }
    });
  }

  // Normalización L2 (Magnitud unitaria = 1.0)
  const magnitud = Math.sqrt(vectorBruto.reduce((acc, val) => acc + val * val, 0));
  return vectorBruto.map((val) => Number((val / magnitud).toFixed(4)));
}

/**
 * Conector opcional para generar Embeddings reales usando la API de OpenAI
 */
export async function generarEmbeddingOpenAI(texto, apiKey = process.env.OPENAI_API_KEY) {
  if (!apiKey) {
    return {
      provider: "campuslands-local-semantic-8d",
      dimensions: 8,
      vector: generarEmbeddingIA(texto)
    };
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texto
    })
  });

  const data = await response.json();
  return {
    provider: "openai-text-embedding-3-small",
    dimensions: data.data[0].embedding.length,
    vector: data.data[0].embedding
  };
}
