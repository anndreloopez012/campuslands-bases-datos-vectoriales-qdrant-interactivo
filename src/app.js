/**
 * Servidor Principal Express: Laboratorio de Bases de Datos Vectoriales, Qdrant e IA
 * ----------------------------------------------------------------------------------
 * Inicializa la colección por defecto 'campuslands_ia' en memoria con sus Points
 * semilla generados por el Modelo de Embeddings y expone la API REST en /api/.
 */

import express from "express";
import { qdrantServer } from "./engine/qdrantEngine.js";
import { obtenerPuntosSemilla } from "./data/knowledge.seed.js";
import vectorRouter from "./routes/vector.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Inicializar la colección vectorial 'campuslands_ia' con los 6 puntos semilla
export function inicializarColeccionSemilla() {
  const coleccion = qdrantServer.createCollection("campuslands_ia", {
    size: 8,
    distance: "Cosine",
    storage: "in-memory"
  });
  coleccion.upsert(obtenerPuntosSemilla());
  return coleccion;
}

inicializarColeccionSemilla();

// 2. Middleware para parsear JSON
app.use(express.json());

// 3. Endpoint Raíz Informativo
app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "🧠 Bienvenido al Laboratorio de Bases de Datos Vectoriales, Qdrant e IA (Campuslands)",
    motor: "Qdrant Engine Pedagógico (HNSW + Product Quantization + 8D Semantic Embeddings)",
    coleccionActiva: "campuslands_ia",
    endpoints: {
      listar_colecciones: "GET /api/collections",
      inspeccionar_coleccion: "GET /api/collections/campuslands_ia",
      insertar_point_con_ia: "PUT /api/collections/campuslands_ia/points",
      busqueda_semantica_ia: "POST /api/collections/campuslands_ia/search"
    }
  });
});

// 4. Montar el Enrutador Vectorial bajo '/api'
app.use("/api", vectorRouter);

// 5. Iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n====================================================================`);
    console.log(`🧠 Servidor Vectorial Qdrant + IA activo en http://localhost:${PORT}`);
    console.log(`📦 Colección 'campuslands_ia' cargada con 6 Points de 8 dimensiones`);
    console.log(`🔎 Búsqueda semántica lista en POST /api/collections/campuslands_ia/search`);
    console.log(`====================================================================\n`);
  });
}

export default app;
