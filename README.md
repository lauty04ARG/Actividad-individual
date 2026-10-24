# ComunidadCursos

> WebApp de gestión de comunidad de cursos: catálogo comunitario de cursos gratuitos y validados + roadmaps personales de aprendizaje.
>
> **Estado:** 📚 Documentación (Instancia A) — Desarrollo de código fuente pendiente de aprobación docente.

**Stack Tecnológico:** React 19 + Vite + pnpm · FastAPI + uv · PostgreSQL 18.6 · Docker Compose (dev)

---

## Qué hace

**ComunidadCursos** es una plataforma colaborativa diseñada para estudiantes universitarios y autodidactas. Permite a cualquier miembro de la comunidad aportar cursos gratuitos de cualquier proveedor web con metadatos completos y una declaración obligatoria de cursada previa. Tras una validación administrativa que certifica la vigencia del contenido, el curso se publica en un catálogo comunitario abierto y paginado, desde el cual cada estudiante puede estructurar y dar seguimiento a su propio roadmap personal de aprendizaje.

---

## Documentación Oficial (Instancia A)

La especificación completa del sistema se encuentra organizada en los 7 documentos de ingeniería requeridos por la cátedra:

| Documento | Pregunta que Responde | Enlace Directo |
|-----------|------------------------|----------------|
| **SPEC** | ¿Qué nos pidieron construir originalmente y qué decidimos nosotros sobre los vacíos? | [docs/SPEC.md](docs/SPEC.md) |
| **PRD** | ¿Para quién construimos, qué problema resuelve, qué hace (P0) y qué NO hace? | [docs/PRD.md](docs/PRD.md) |
| **TRD** | ¿Cómo lo construimos técnicamente, qué arquitectura usamos y por qué esas decisiones? | [docs/TRD.md](docs/TRD.md) |
| **UX-UI** | ¿Cómo se ve, se siente y se comporta la interfaz (estilo Google, mobile-first, menú sándwich)? | [docs/UX-UI.md](docs/UX-UI.md) |
| **APPFlow** | ¿Qué pantallas existen, cómo se navegan y cuáles son los flujos de usuario (Mermaid)? | [docs/APPFlow.md](docs/APPFlow.md) |
| **BackendSchema** | ¿Qué datos persistimos en PostgreSQL 18.6 y qué contratos REST expone el backend FastAPI? | [docs/BackendSchema.md](docs/BackendSchema.md) |
| **Implementation Plan** | ¿En qué orden construimos los módulos y cómo sabemos que cada tarea está terminada? | [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) |

---

## Cómo revisar este repositorio

- **Renderizado nativo:** Todos los archivos `.md` y diagramas de Mermaid (`erDiagram`, `flowchart`, `sequenceDiagram`, `stateDiagram-v2`) se renderizan de forma interactiva y legible directamente en la interfaz web de GitHub.
- **Vista previa local en VS Code:** Abrir cualquier archivo de la carpeta `docs/` y presionar `Ctrl + Shift + V` (o extensión *Markdown All in One*).
- **Gate de Aprobación de la Instancia A:** Siguiendo las reglas de la cátedra, este repositorio **no contiene código fuente** (`.py`, `.js`, `.tsx`, `node_modules`, `.venv`, etc.). Todo el código arrancará en la Instancia B una vez obtenida la aprobación formal.

---

## Estado del Trabajo Práctico

| Instancia | Contenido y Alcance | Estado Actual |
|-----------|---------------------|:-------------:|
| **Instancia A — Documentación** | Repositorio GitHub + 7 documentos normativos + `.gitignore` + `README.md` | ✅ **Completada y Lista para Revisión** |
| **Instancia B — Desarrollo del MVP** | Ejecución del Implementation Plan (historias P0 en Docker Compose) | ⏳ Pendiente de Aprobación Docente |
| **Instancia C — Clase del 27/10** | Testing unitario e integración, Docker multi-stage y gestión del cambio | ⏳ Planificada |

---

## Versionado y Flujo de Git

- **Flujo elegido:** **GitHub Flow** con ramas temáticas (`docs/spec-and-prd`, `docs/ux-and-flows`, `docs/architecture-and-schema`, `docs/plan-and-readme`) integradas a `main` mediante `git merge --no-ff` (o Pull Requests) para preservar la trazabilidad del árbol de trabajo.
- **Convención de commits:** **Conventional Commits** al 100% de la historia (`docs:`, `feat:`, `fix:`, `refactor:`, `chore:`). Prohibidos los commits genéricos.
- **Evolución evidenciada:** El commit inicial preserva la `SPEC.md` original de clase sin modificar, mostrando en commits posteriores el refinamiento y la resolución de vacíos.

---

## Instrucciones Previstas para la Instancia B

Una vez recibida la aprobación del docente y habilitado el inicio de la Instancia B, el proyecto levantará en cualquier entorno limpio con:

```bash
# 1. Clonar el repositorio
git clone https://github.com/lauty04ARG/Actividad-individual.git
cd Actividad-individual

# 2. Levantar la aplicación completa con Docker Compose
docker compose up --build
```

- **Frontend:** `http://localhost:5173`
- **Backend API Docs (Swagger / OpenAPI):** `http://localhost:8000/docs`
- **PostgreSQL 18.6:** `localhost:5432`

---

## Licencia y Uso

Trabajo Práctico Individual — Materia: **Desarrollo de Software** (Sección S34)  
Ciclo Lectivo 2026.
