# ComunidadCursos

> WebApp de gestión de comunidad de cursos: catálogo comunitario de cursos gratuitos y validados + roadmaps personales de aprendizaje.
>
> **Estado:** 🚧 En Desarrollo (Instancia B — Scaffold Mínimo) — Rama de integración: `dev`.

**Stack Tecnológico:** React 19 + Vite + pnpm · FastAPI + uv · PostgreSQL 18.6 · Docker Compose (dev)

---

## Cómo Levantar el Entorno de Desarrollo (Inicio Rápido)

Instrucciones verificables para ejecutar en una máquina limpia:

```bash
# 1. Clonar el repositorio y situarse en la carpeta
git clone https://github.com/lauty04ARG/Actividad-individual.git
cd Actividad-individual

# 2. Crear archivo de variables de entorno a partir de la plantilla
cp .env.example .env

# 3. Levantar los 3 servicios orquestados con Docker Compose (dev)
docker compose up
```

### URLs de Verificación y Servicios
- **Frontend SPA (Vite + React 19):** `http://localhost:5173`
- **Backend Health Check (FastAPI):** `http://localhost:8000/health`
- **Documentación Interactiva Swagger / OpenAPI:** `http://localhost:8000/docs`
- **Base de Datos PostgreSQL 18.6:** `localhost:5432`

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

---

## Estado del Trabajo Práctico

| Instancia | Contenido y Alcance | Estado Actual |
|-----------|---------------------|:-------------:|
| **Instancia A — Documentación** | Repositorio GitHub + 7 documentos normativos + `.gitignore` + `README.md` | ✅ Aprobada formalmente por el docente |
| **Instancia B — Desarrollo del MVP** | Ejecución de tickets de desarrollo (T1 a T5 para scaffold mínimo) | 🟡 **En desarrollo activo en rama `dev`** |
| **Instancia C — Clase del 27/10** | Testing unitario e integración, Docker multi-stage y gestión del cambio | ⏳ Planificada |

---

## Versionado y Flujo de Git

- **Flujo de ramas:** GitFlow simplificado con rama `main` reservada exclusivamente para releases etiquetadas (`vX.Y.Z`) y rama `dev` como integradora de desarrollo.
- **Ramas de tickets:** Creadas desde `dev` bajo el patrón `feat/T{N}-nombre-ticket` y mergeadas a `dev`.
- **Convención de commits:** **Conventional Commits** al 100% de la historia (`chore:`, `feat:`, `docs:`, `docker:`).

---

## Licencia y Uso

Trabajo Práctico Individual — Materia: **Desarrollo de Software** (Sección S34)  
Ciclo Lectivo 2026.
