# 🧭 Bases de Datos Vectoriales, Qdrant & Ejercicio Práctico con IA

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20ESM-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20Search%20Engine-dc2626)](https://qdrant.tech/)
[![AI Embeddings](https://img.shields.io/badge/AI-Semantic%20Embeddings%20%2B%20RAG-8b5cf6)](#)
[![Interactive Web](https://img.shields.io/badge/GitHub%20Pages-Plataforma%20Interactiva-6366f1)](https://anndreloopez012.github.io/campuslands-bases-datos-vectoriales-qdrant-interactivo/)

> **Guía Interactiva y Ejercicio Práctico de Node.js + Inteligencia Artificial para Estudiantes de Campuslands**
> Aprende desde cero qué son las **Bases de Datos Vectoriales**, cómo funcionan los **Embeddings de Alta Dimensión**, la indexación **HNSW + Product Quantization**, la arquitectura de **Qdrant** (`Collections`, `Points`, `Distance Metrics`, `Storage`) y construye un **Buscador Semántico con IA (RAG)** en Node.js explicado **línea por línea**.

---

## 🌐 Plataforma Web Interactiva (GitHub Pages)

Explora la clase interactiva directamente en tu navegador con simuladores visuales en vivo:

👉 **[Abrir Plataforma Interactiva — Bases de Datos Vectoriales & Qdrant](https://anndreloopez012.github.io/campuslands-bases-datos-vectoriales-qdrant-interactivo/)**

### ¿Qué incluye la plataforma interactiva?
1. **1. Bases de Datos Vectoriales**: Comparativa visual entre bases de datos tradicionales (`SQL WHERE LIKE`) y búsqueda semántica por significado.
2. **1.1 Definición + Simulador Grid 2D de Animales**: Plano bidimensional interactivo (**Eje X**: Color del animal; **Eje Y**: Tamaño del animal) donde puedes cambiar el punto de referencia (`Imagen A`, `Imagen B`, `Imagen C`, `Imagen E`) y ver en vivo cómo se calcula la distancia euclidiana.
3. **1.2 Funcionamiento + Máquina Mágica de Crayones**: Simulador interactivo de clasificación vectorial cromática `[R, G, B]` junto con técnicas de indexación (**Hashing**, **Cuantización** y **Grafos HNSW**).
4. **1.3 Funcionamiento a Nivel de Arquitectura**: Flujo completo `Contenido Crudo` ➔ `Embedding Model (IA)` ➔ `Vector Embedding` ➔ `Vector Database ( Similarity Search )`.
5. **1.4 Qdrant (Motor Vectorial en Rust)**: Indexación basada en grafos **HNSW (Hierarchical Navigable Small World)** y compresión mediante **Product Quantization (PQ)**.
6. **1.5 Arquitectura de Qdrant**: Diagrama interactivo de `Collections`, `Distance Metrics` (`Cosine`, `Euclidean`, `Dot Product`), anatomía de un `Point` (`id`, `vector`, `payload`), `Storage` (`In-Memory` vs `Memmap`) y `Clients` (`REST` / `gRPC`).
7. **2.1 al 2.3 Visor de Código Estilo VS Code (Línea por Línea)**: Explicación interactiva línea por línea con resaltado de sintaxis VS Code Dark+, sin recortes de código y con salto de línea automático.
8. **3. Laboratorio en Vivo: Buscador Semántico con IA + Qdrant Sandbox**: Prueba consultas en lenguaje natural, cambia la métrica de distancia (`Cosine`, `Euclidean`, `Dot`), inspecciona el vector generado por IA de 8 dimensiones y haz `Upsert` de nuevos `Points` con tu propio texto.

---

## 📚 Resumen Teórico de la Clase

### 1. ¿Por qué las Vector Databases?
En la era actual, los datos no estructurados (texto en lenguaje natural, imágenes, audio y video) requieren búsquedas por **significado semántico** en lugar de coincidencias literales de palabras.

| Característica | Base de Datos Tradicional (SQL / NoSQL) | Base de Datos Vectorial (Qdrant) |
| :--- | :--- | :--- |
| **Unidad de datos** | Filas tabulares / Documentos JSON | **Points** (`id` + `vector` + `payload`) |
| **Tipo de consulta** | Coincidencia exacta (`WHERE texto LIKE '%perro%'`) | **Similitud Semántica** (*k-NN / ANN Search*) |
| **Comprensión de sinónimos** | ❌ No entiende que *"canino"* y *"mascota"* se relacionan | ✅ Los vectores quedan cerca en el espacio multidimensional |
| **Escala** | Millones de registros indexados por B-Tree | Billones de vectores indexados con **HNSW + Quantization** |

### 1.1 Representación en un Grid 2D (Ejemplo de Animales)
Si representamos animales según **Eje X (Color: Marrón, Negro, Blanco)** y **Eje Y (Tamaño: Pequeño, Mediano, Grande)**:
- **Imagen A**: Marrón, tamaño mediano (`[1.0, 2.0]`)
- **Imagen B**: Negro, tamaño pequeño (`[2.0, 1.0]`)
- **Imagen C**: Blanco, tamaño grande (`[3.0, 3.0]`)
- **Imagen E**: Negro, tamaño grande (`[2.0, 3.0]`)

La proximidad geométrica entre dos puntos refleja qué tan similares son sus atributos. En producción, los modelos de IA generan vectores de **384, 768 o 1536 dimensiones**.

### 1.2 y 1.4 Técnicas de Indexación y Qdrant
Para evitar comparar un vector contra millones uno por uno, **Qdrant** (escrito en **Rust**) utiliza:
1. **HNSW (Hierarchical Navigable Small World)**: Construye un grafo multicapa donde las capas superiores tienen saltos largos ("autopistas") y las capas inferiores refinan los vecinos más cercanos en milisegundos.
2. **Product Quantization (PQ)**: Divide vectores largos en sub-vectores y los comprime en códigos cortos, reduciendo el uso de RAM hasta en un 90% y acelerando el cálculo de distancias.

### 1.5 Conceptos Clave de la Arquitectura de Qdrant
- **Collections**: Conjunto nombrado de puntos que comparten la misma dimensión (`size`) y métrica (`distance`).
- **Distance Metrics**:
  - `Cosine`: Mide el ángulo entre dos vectores ($[-1, 1]$). Ideal para **texto y embeddings de IA**.
  - `Euclidean` ($L_2$): Mide la distancia en línea recta entre dos puntos.
  - `Dot Product`: Producto punto directo, muy veloz cuando los vectores ya están normalizados.
- **Points**: La entidad central compuesta por:
  - `id`: Identificador único numérico o UUID.
  - `vector`: Arreglo de flotantes (`[0.88, 0.12, ...]`).
  - `payload`: Metadatos JSON adicionales (`titulo`, `categoria`, `texto`).
- **Storage**: `In-Memory` (máxima velocidad en RAM) o `Memmap` (mapeo directo desde disco SSD).

---

##🗂️ Estructura del Proyecto

```text
campuslands-bases-datos-vectoriales-qdrant-interactivo/
├── index.html                      # Plataforma Web Interactiva (10 módulos + Simuladores + VS Code + AI Sandbox)
├── package.json                    # Configuración Node.js ESM y scripts
├── src/
│   ├── engine/
│   │   └── qdrantEngine.js         # Motor Qdrant en memoria (Collections, Points, Cosine/Euclidean/Dot)
│   ├── ai/
│   │   └── embeddingsModel.js      # Modelo de Embeddings IA de 8 dimensiones + Conector OpenAI opcional
│   ├── data/
│   │   └── knowledge.seed.js       # 6 Points iniciales vectorizados automáticamente con IA
│   ├── routes/
│   │   └── vector.routes.js        # Endpoints REST (/collections, /points/upsert, /points/search + RAG)
│   └── app.js                      # Servidor Express principal e inicialización de la colección 'campuslands_ia'
├── examples/
│   └── qdrant-sdk-real.js          # Ejemplo con el SDK oficial @qdrant/js-client-rest hacia Docker (:6333)
└── test/
    └── test-vector-db.js           # Suite automatizada de 5 pruebas integrales (Cosine, Euclidean, Upsert IA)
```

---

## 🚀 Instalación y Ejecución Paso a Paso

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/anndreloopez012/campuslands-bases-datos-vectoriales-qdrant-interactivo.git
cd campuslands-bases-datos-vectoriales-qdrant-interactivo
npm install
```

### 2. Iniciar el servidor Node.js + Motor Vectorial IA
```bash
npm start
```
El servidor iniciará en `http://localhost:3000` e indexará automáticamente los 6 `Points` iniciales en la colección `campuslands_ia` (`size: 8`, `distance: Cosine`).

### 3. Ejecutar las pruebas automatizadas
```bash
npm test
```
Ejecuta las 5 pruebas de verificación:
1. Estado de la colección `campuslands_ia` (`size: 8`, `distance: Cosine`, `totalPoints: 6`).
2. Búsqueda semántica por significado (consulta sobre *"velocidad y memoria"* encuentra el Point de **HNSW + Product Quantization** sin compartir palabras exactas).
3. Búsqueda semántica sobre conceptos de IA (*"convertir oraciones en listas de números"* encuentra **Embeddings con IA**).
4. Inserción (`Upsert`) de un nuevo `Point` vectorizado automáticamente por IA y verificación de recuperación #1.
5. Búsqueda cambiando la métrica de distancia a `Euclidean`.

---

## 🧪 Pruebas Rápidas con cURL

### 1. Consultar estado de la Collection `campuslands_ia`
```bash
curl -i http://localhost:3000/api/vector/collections/campuslands_ia
```

### 2. Realizar una Búsqueda Semántica con IA + RAG (`POST /points/search`)
Observa cómo buscamos con nuestras propias palabras y el motor encuentra los conceptos más cercanos por significado:
```bash
curl -s -X POST http://localhost:3000/api/vector/collections/campuslands_ia/points/search \
  -H "Content-Type: application/json" \
  -d '{
    "queryText": "como hace la base de datos para buscar rapido entre millones de datos sin gastar tanta memoria",
    "limit": 3,
    "distanceMetric": "Cosine"
  }' | json_pp
```

### 3. Insertar (`Upsert`) un nuevo Point vectorizado automáticamente por IA
```bash
curl -s -X POST http://localhost:3000/api/vector/collections/campuslands_ia/points \
  -H "Content-Type: application/json" \
  -d '{
    "id": 107,
    "titulo": "Asistentes Conversacionales con RAG",
    "categoria": "IA Generativa",
    "texto": "Los chatbots inteligentes consultan una base vectorial como Qdrant para recuperar contexto semántico antes de responder al estudiante."
  }' | json_pp
```

---

## 🐳 Opcional: Conectar con Qdrant Real en Docker

Si deseas probar contra el motor Qdrant oficial en Docker además del motor educativo incluido:

```bash
# 1. Levantar Qdrant en Docker
docker run -d -p 6333:6333 -p 6334:6334 --name qdrant-campuslands qdrant/qdrant

# 2. Instalar el cliente oficial de Qdrant
npm install @qdrant/js-client-rest

# 3. Ejecutar el ejemplo oficial incluido
node examples/qdrant-sdk-real.js
```

---

## 🌿 Flujo de Trabajo Git por Ramas (`feat/*` ➔ `dev` ➔ `main`)

Este repositorio fue construido paso a paso siguiendo buenas prácticas de ramas para que los estudiantes puedan inspeccionar la evolución del proyecto:

| Rama | Contenido |
| :--- | :--- |
| `feat/01-setup-project-esm` | Configuración inicial de `package.json` con ES Modules (`"type": "module"`) y Express. |
| `feat/02-qdrant-vector-engine` | Implementación de `src/engine/qdrantEngine.js` (`QdrantCollection`, `Cosine`, `Euclidean`, `Dot`) y `examples/qdrant-sdk-real.js`. |
| `feat/03-ai-embeddings-and-seed` | Creación del modelo de Embeddings IA de 8 dimensiones (`src/ai/embeddingsModel.js`) y semilla de conocimiento (`src/data/knowledge.seed.js`). |
| `feat/04-api-routes-and-tests` | Rutas REST en `src/routes/vector.routes.js`, servidor `src/app.js` y suite de pruebas `test/test-vector-db.js`. |
| `feat/05-interactive-web-platform` | Plataforma web interactiva `index.html` con simuladores 2D, caja de crayones, visor VS Code línea a línea y Sandbox IA. |
| `feat/06-documentation-readme` | Documentación técnica completa en `README.md`. |
| `dev` | Rama de integración donde confluyen todas las funcionalidades verificadas. |
| `main` | Rama de producción sincronizada y desplegada en GitHub Pages (`v1.0.0`). |

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Material educativo desarrollado para **Campuslands**.
