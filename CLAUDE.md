# Directivas para Claude Code (`CLAUDE.md`)

Lee y respeta todas las reglas definidas en `AGENTS.md`.

## Resumen de Arquitectura
- **`src/engine/qdrantEngine.js`**: Implementación pedagógica de la arquitectura de Qdrant (`Collections`, `Points` con `id`/`vector`/`payload`, `Distance Metrics`: `Cosine`, `Euclidean`, `Dot`, y modos de `Storage`).
- **`src/ai/embeddingsModel.js`**: Modelo generador de Embeddings vectoriales semánticos de 8 dimensiones + conector opcional con API de IA (OpenAI / Gemini).
- **`src/data/knowledge.seed.js`**: Dataset inicial de puntos vectoriales con sus payloads JSON.
- **`src/routes/vector.routes.js`**: API REST estilo Qdrant para gestionar colecciones, insertar puntos (`upsert`) y ejecutar búsquedas por similitud semántica (`search`).
- **`examples/qdrant-sdk-real.js`**: Ejemplo de conexión a un contenedor real de Qdrant (`localhost:6333`) con `@qdrant/js-client-rest`.
- **`index.html`**: Plataforma web interactiva con simuladores 2D de animales, máquina de crayones, arquitectura de Qdrant, visor VS Code Dark+ línea a línea y Sandbox de Búsqueda Semántica con IA.
