/**
 * Motor Pedagógico de Base de Datos Vectorial estilo Qdrant (src/engine/qdrantEngine.js)
 * --------------------------------------------------------------------------------------
 * Implementa en JavaScript puro los 5 pilares de la Arquitectura de Qdrant (Sección 1.5):
 * 1. Collections (Colecciones): Espacio nombrado con dimensión fija y métrica única.
 * 2. Distance Metrics (Métricas de Distancia): Cosine, Euclidean y Dot Product.
 * 3. Points (Puntos): Entidad central formada por { id, vector, payload }.
 * 4. Storage (Almacenamiento): Modo 'in-memory' (RAM) o 'memmap' (Disco virtual).
 * 5. Similarity Search: Búsqueda por similitud semántica (k-NN / HNSW simulado) + filtros de payload.
 */

export class QdrantCollection {
  constructor(name, config = {}) {
    this.name = name;
    this.size = config.size || 8; // Dimensionalidad obligatoria de los vectores
    this.distance = config.distance || "Cosine"; // 'Cosine' | 'Euclidean' | 'Dot'
    this.storage = config.storage || "in-memory"; // 'in-memory' | 'memmap'
    this.hnswConfig = {
      m: 16,
      efConstruct: 100,
      quantization: "ProductQuantization (PQ)"
    };
    this.points = new Map(); // Almacena Points indexados por su ID único
  }

  /**
   * Inserta o actualiza (Upsert) uno o varios Points en la colección.
   * Cada Point debe tener: { id, vector, payload }
   */
  upsert(pointsArray) {
    const list = Array.isArray(pointsArray) ? pointsArray : [pointsArray];

    for (const pt of list) {
      if (pt.id === undefined || pt.id === null) {
        throw new Error("Cada Point en Qdrant requiere un 'id' único.");
      }
      if (!Array.isArray(pt.vector) || pt.vector.length !== this.size) {
        throw new Error(
          `Dimensión inválida en Point ID ${pt.id}: la colección '${this.name}' exige vectores de dimensión ${this.size}, pero recibió ${pt.vector?.length}.`
        );
      }

      this.points.set(pt.id, {
        id: pt.id,
        vector: pt.vector.map(Number),
        payload: pt.payload || {}
      });
    }

    return {
      status: "completed",
      collection: this.name,
      upsertedCount: list.length,
      totalPoints: this.points.size
    };
  }

  /**
   * Ejecuta una Búsqueda por Similitud (Similarity Search) comparando el vector
   * de la consulta contra los vectores almacenados en la colección.
   */
  search(queryVector, options = {}) {
    if (!Array.isArray(queryVector) || queryVector.length !== this.size) {
      throw new Error(
        `El vector de búsqueda debe tener exactamente ${this.size} dimensiones.`
      );
    }

    const limit = options.limit || 4;
    const filterCategory = options.category || null;
    const results = [];

    for (const point of this.points.values()) {
      // Filtro opcional sobre el Payload JSON
      if (filterCategory && point.payload?.categoria !== filterCategory) {
        continue;
      }

      const metricValue = calcularSimilitud(queryVector, point.vector, this.distance);

      results.push({
        id: point.id,
        score: Number(metricValue.score.toFixed(4)),
        rawDistance: Number(metricValue.rawDistance.toFixed(4)),
        metricUsed: this.distance,
        payload: point.payload,
        vectorPreview: point.vector.slice(0, 4).map((n) => Number(n.toFixed(3)))
      });
    }

    // Ordenar de mayor a menor similitud semántica (score más alto primero)
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  getInfo() {
    return {
      name: this.name,
      vectorsConfig: {
        size: this.size,
        distance: this.distance
      },
      storageMode: this.storage,
      indexingEngine: this.hnswConfig,
      pointsCount: this.points.size,
      points: Array.from(this.points.values())
    };
  }
}

/**
 * Calcula las 3 métricas de distancia oficiales de Qdrant:
 * 1. Cosine Similarity (Similitud del Coseno)
 * 2. Euclidean Distance (Distancia Euclidiana L2)
 * 3. Dot Product (Producto Punto)
 */
export function calcularSimilitud(vecA, vecB, metric = "Cosine") {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  let sumSqDiff = 0;

  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dot += a * b;
    normA += a * a;
    normB += b * b;
    const diff = a - b;
    sumSqDiff += diff * diff;
  }

  const euclideanDist = Math.sqrt(sumSqDiff);

  if (metric === "Euclidean") {
    // En distancia euclidiana menor distancia = mayor similitud.
    // Convertimos a score en rango (0, 1] mediante 1 / (1 + d) para ranking uniforme.
    return {
      score: 1 / (1 + euclideanDist),
      rawDistance: euclideanDist
    };
  }

  if (metric === "Dot") {
    return {
      score: dot,
      rawDistance: dot
    };
  }

  // Por defecto: Cosine Similarity
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  const cosine = denom === 0 ? 0 : dot / denom;
  return {
    score: cosine,
    rawDistance: 1 - cosine
  };
}

/**
 * Gestor Central de Colecciones de Qdrant en Memoria
 */
class QdrantServerManager {
  constructor() {
    this.collections = new Map();
  }

  createCollection(name, config) {
    const col = new QdrantCollection(name, config);
    this.collections.set(name, col);
    return col;
  }

  getCollection(name) {
    return this.collections.get(name) || null;
  }

  listCollections() {
    return Array.from(this.collections.values()).map((c) => ({
      name: c.name,
      size: c.size,
      distance: c.distance,
      storage: c.storage,
      pointsCount: c.points.size
    }));
  }
}

export const qdrantServer = new QdrantServerManager();
