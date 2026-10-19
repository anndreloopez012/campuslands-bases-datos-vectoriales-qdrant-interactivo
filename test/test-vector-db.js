/**
 * Suite de Pruebas End-to-End: Bases de Datos Vectoriales, Qdrant e IA
 * --------------------------------------------------------------------
 * Verifica automáticamente:
 * 1. GET /api/collections (Colección 'campuslands_ia' con 6 Points semilla de dimensión 8)
 * 2. POST /api/collections/campuslands_ia/search (Búsqueda semántica con IA por significado, no literal)
 * 3. PUT /api/collections/campuslands_ia/points (Inserción de nuevo Point generando vector con IA)
 * 4. Comparación de métricas Cosine Similarity vs Euclidean Distance
 */

import assert from "node:assert/strict";
import app from "../src/app.js";

const PORT = 3399;
const BASE_URL = `http://localhost:${PORT}`;

let server;

async function runVectorTests() {
  console.log("🧪 [INICIANDO PRUEBAS DE BASE DE DATOS VECTORIAL QDRANT + IA]...\n");

  server = app.listen(PORT);

  try {
    // 1. Verificar colección inicial
    console.log("1. Verificando colección 'campuslands_ia' y sus Points iniciales...");
    const resCol = await fetch(`${BASE_URL}/api/collections/campuslands_ia`);
    assert.equal(resCol.status, 200);
    const jsonCol = await resCol.json();
    assert.equal(jsonCol.coleccion.pointsCount, 6, "Debe iniciar con 6 Points semilla");
    assert.equal(jsonCol.coleccion.vectorsConfig.size, 8, "La dimensión vectorial debe ser 8");
    console.log("   ✅ PASÓ: Colección 'campuslands_ia' activa con 6 Points de 8 dimensiones");

    // 2. Búsqueda Semántica con IA (Consulta sobre grafos y compresión en vectores)
    console.log("2. Probando Búsqueda Semántica con IA (Cosine Similarity)...");
    const resSearch = await fetch(`${BASE_URL}/api/collections/campuslands_ia/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "motor que usa grafos HNSW y cuantizacion para indexar vectores en memoria RAM",
        limit: 3,
        distance: "Cosine"
      })
    });
    assert.equal(resSearch.status, 200);
    const jsonSearch = await resSearch.json();
    assert.equal(
      jsonSearch.resultadosSimilitud[0].id,
      101,
      "El punto más cercano debe ser el ID 101 (Qdrant HNSW)"
    );
    console.log(
      `   ✅ PASÓ: Búsqueda semántica encontró "${jsonSearch.resultadosSimilitud[0].payload.titulo}" (Score: ${jsonSearch.resultadosSimilitud[0].score})`
    );

    // 3. Búsqueda Semántica de Videojuegos sin usar la palabra exacta del título
    console.log("3. Probando Búsqueda por Significado (Aventura en consola con espadas)...");
    const resGames = await fetch(`${BASE_URL}/api/collections/campuslands_ia/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "jugar una aventura de mundo abierto en consola con espadas",
        limit: 2,
        distance: "Cosine"
      })
    });
    const jsonGames = await resGames.json();
    assert.equal(
      jsonGames.resultadosSimilitud[0].id,
      106,
      "Debe recuperar el punto de Videojuegos (ID 106) por similitud semántica"
    );
    console.log(
      `   ✅ PASÓ: Búsqueda por significado recuperó "${jsonGames.resultadosSimilitud[0].payload.titulo}"`
    );

    // 4. Insertar un nuevo Point generando su Embedding automáticamente con IA
    console.log("4. Probando PUT /api/collections/campuslands_ia/points (Upsert con IA)...");
    const resUpsert = await fetch(`${BASE_URL}/api/collections/campuslands_ia/points`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 107,
        titulo: " Despliegue de Clúster Qdrant en Docker para Billones de Vectores",
        categoria: "Cloud & Escalabilidad",
        descripcion: "Contenedores en producción para escalar búsquedas vectoriales a gran volumen con alta velocidad."
      })
    });
    assert.equal(resUpsert.status, 200);
    const jsonUpsert = await resUpsert.json();
    assert.equal(jsonUpsert.operacion.totalPoints, 7, "Ahora la colección debe tener 7 Points");
    assert.equal(jsonUpsert.pointGuardado.vector.length, 8, "El modelo IA generó un vector de 8 dimensiones");
    console.log("   ✅ PASÓ: Nuevo Point #107 vectorizado con IA e indexado en Qdrant");

    // 5. Búsqueda con métrica Euclidean Distance
    console.log("5. Probando búsqueda con métrica Euclidean Distance...");
    const resEuclid = await fetch(`${BASE_URL}/api/collections/campuslands_ia/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "docker contenedor en produccion para billones de vectores",
        limit: 2,
        distance: "Euclidean"
      })
    });
    const jsonEuclid = await resEuclid.json();
    assert.equal(jsonEuclid.metricaUtilizada, "Euclidean");
    assert.equal(jsonEuclid.resultadosSimilitud[0].id, 107);
    console.log(
      `   ✅ PASÓ: Métrica Euclidean localizó el nuevo Point #107 (Distancia L2: ${jsonEuclid.resultadosSimilitud[0].rawDistance})`
    );

    console.log("\n🎉 ¡TODAS LAS PRUEBAS (5/5) DE QDRANT Y EMBEDDINGS IA PASARON CON ÉXITO!\n");
  } catch (err) {
    console.error("❌ Falló una prueba:", err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runVectorTests();
