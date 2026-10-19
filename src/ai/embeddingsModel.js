/**
 * Modelo Generador de Embeddings con IA (src/ai/embeddingsModel.js)
 * -----------------------------------------------------------------
 * Tal como explica la Sección 1.3 de la clase, antes de guardar o buscar
 * en una base de datos vectorial (como Qdrant), un Modelo de Embeddings
 * traduce el texto en lenguaje natural a un vector numérico multidimensional
 * que captura su significado semántico.
 *
 * Dimensiones Semánticas del Vector (8 Dimensiones):
 * [0] IA & Modelos de Lenguaje (LLMs, embeddings, semántica, asistentes)
 * [1] Backend & APIs (Node.js, Express, servidores, rutas, HTTP)
 * [2] Frontend & Interfaces (UI, web, navegador, diseño, componentes)
 * [3] Bases de Datos & Persistencia (Qdrant, SQL, colecciones, memoria, disco)
 * [4] Ciberseguridad & Tráfico (Rate limit, DoS, firewall, protección, tokens)
 * [5] Videojuegos & Entretenimiento (RPG, aventura, consolas, jugadores, mundos)
 * [6] Algoritmos & Matemáticas (Vectores, HNSW, grafos, coseno, euclidiana, cuantización)
 * [7] Cloud & Escalabilidad (Docker, millones, billones, clúster, alta velocidad)
 */

export const DIMENSIONES_SEMANTICAS = [
  "IA & Lenguaje Natural",
  "Backend & Node.js",
  "Frontend & UI Web",
  "Bases de Datos & Storage",
  "Seguridad & Rate Limit",
  "Videojuegos & Gaming",
  "Matemáticas & Grafos HNSW",
  "Cloud & Escalabilidad"
];

const DICCIONARIO_SEMANTICO = [
  // Dim 0: IA & Lenguaje Natural
  ["ia", "inteligencia", "artificial", "embedding", "embeddings", "llm", "chatgpt", "openai", "gemini", "semantica", "semantico", "significado", "lenguaje", "natural", "asistente", "conversacional", "chatbot", "rag", "neuronal", "red"],
  // Dim 1: Backend & Node.js
  ["backend", "node", "nodejs", "express", "api", "rest", "servidor", "endpoint", "middleware", "peticion", "http", "json", "javascript", "typescript", "cliente", "sdk"],
  // Dim 2: Frontend & UI Web
  ["frontend", "interfaz", "ui", "ux", "html", "css", "react", "web", "navegador", "visual", "color", "crayones", "crayon", "azul", "imagen", "imagenes", "diseño"],
  // Dim 3: Bases de Datos & Storage
  ["base", "datos", "database", "vectorial", "qdrant", "coleccion", "collection", "collections", "point", "points", "punto", "payload", "storage", "memoria", "ram", "memmap", "disco", "sql", "tabular", "almacenar", "indexar", "buscar", "consulta"],
  // Dim 4: Seguridad & Rate Limit
  ["seguridad", "proteger", "proteccion", "ratelimit", "limit", "dos", "ataque", "denegacion", "ip", "429", "bloqueo", "firewall", "autenticacion", "trafico", "abuso"],
  // Dim 5: Videojuegos & Gaming
  ["videojuego", "videojuegos", "juego", "juegos", "zelda", "elden", "ring", "rpg", "aventura", "consola", "switch", "ps5", "gamer", "jugador", "espada", "mundo", "abierto", "hollow", "cyberpunk"],
  // Dim 6: Matemáticas & Grafos HNSW
  ["vector", "vectores", "dimension", "dimensionalidad", "hnsw", "grafo", "grafos", "cuantizacion", "quantization", "hashing", "bucket", "coseno", "cosine", "euclidiana", "euclidean", "distancia", "metrica", "similitud", "cercano", "knn", "faiss"],
  // Dim 7: Cloud & Escalabilidad
  ["escalabilidad", "billones", "millones", "volumen", "docker", "contenedor", "produccion", "velocidad", "rapido", "eficiente", "rendimiento", "nube", "cluster", "comprimir"]
];

/**
 * Normaliza un texto eliminando tildes y signos de puntuación
 */
function limpiarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

/**
 * Genera un vector de embedding normalizado de 8 dimensiones a partir de cualquier texto.
 * Permite ejecutar el laboratorio 100% gratis y sin latencia en local o navegador.
 */
export function generarEmbeddingIA(texto) {
  const limpio = limpiarTexto(texto);
  const palabras = limpio.split(/\s+/).filter(Boolean);
  const vectorBruto = new Array(8).fill(0.08); // Base mínima para evitar vectores nulos

  for (const palabra of palabras) {
    DICCIONARIO_SEMANTICO.forEach((listaClaves, dimIndex) => {
      for (const clave of listaClaves) {
        if (palabra === clave) {
          vectorBruto[dimIndex] += 1.0;
        } else if (palabra.length >= 4 && (palabra.includes(clave) || clave.includes(palabra))) {
          vectorBruto[dimIndex] += 0.55;
        }
      }
    });
  }

  // Normalización L2 (Magnitud unitaria = 1.0, estándar en modelos de Embeddings de IA)
  const magnitud = Math.sqrt(vectorBruto.reduce((acc, val) => acc + val * val, 0));
  return vectorBruto.map((val) => Number((val / magnitud).toFixed(4)));
}

/**
 * Conector opcional para generar Embeddings reales usando la API de OpenAI
 * (text-embedding-3-small) cuando el estudiante configura OPENAI_API_KEY.
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
