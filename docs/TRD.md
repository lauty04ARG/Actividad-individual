# TRD — Technical Requirements Document — ComunidadCursos

> **Qué es este documento:** define el CÓMO técnico de **ComunidadCursos**. Establece las decisiones de arquitectura, especificación del stack, estructura de carpetas por dominio (Screaming Architecture), contratos de comunicación y convenciones de desarrollo.
> **Cuándo está bien:** cualquier desarrollador que lea este documento puede levantar el entorno de desarrollo con Docker Compose, comprender el flujo de dependencias entre capas sin ambigüedades y tomar decisiones técnicas consistentes con el diseño original.

---

## 1. Stack y Versiones Exactas

| Capa / Componente | Tecnología Seleccionada | Versión Exacta | Justificación Técnica |
|-------------------|-------------------------|----------------|-----------------------|
| **Frontend** | React + Vite + pnpm | React `19.0.0` · Vite `6.0.0` · pnpm `10.0.0` | Estipulado por la consigna. React 19 provee compilación moderna y hooks optimizados; Vite garantiza recarga ultrarrápida (HMR) y pnpm optimiza almacenamiento mediante enlaces duros. |
| **Backend** | FastAPI + uv | FastAPI `0.115.0` · uv `0.5.0` · Python `3.12-slim` | Concurrencia nativa con `asyncio`, validación estricta en tiempo de ejecución con Pydantic v2 y uv como gestor de paquetes 10x más rápido que pip. |
| **ORM / Driver BD** | SQLAlchemy (Async) + asyncpg | SQLAlchemy `2.0.36` · asyncpg `0.30.0` | Patrón Data Mapper / Declarativo con soporte nativo de pooling de conexiones asíncronas de alto rendimiento para PostgreSQL. |
| **Base de Datos** | PostgreSQL | `18.6` | Versión requerida por la SPEC de clase, ejecutada sobre la imagen oficial en contenedor Docker. |
| **Infraestructura Dev** | Docker + Docker Compose | Docker Engine `27.x` · Compose v2 | Orquestación reproducible multi-contenedor de base de datos, backend y frontend sin instalar binarios locales en el host. |

---

## 2. Decisiones Técnicas (Trade-offs)

| ID | Decisión | Alternativas Evaluadas | Opción Elegida | Por qué |
|----|----------|------------------------|----------------|---------|
| **TD-001** | Estrategia de Autenticación | 1. Sesiones Stateful en BD/Redis.<br>2. Tokens JWT Stateless (Bearer).<br>3. Proveedor externo (OAuth / Auth0). | **JWT Stateless (HS256)** | No requiere infraestructura adicional de almacenamiento (como Redis) en el MVP; el token contiene el ID de usuario y rol (`estudiante` o `admin`) firmado digitalmente y se valida en cada petición de forma descentralizada. |
| **TD-002** | Estrategia de Paginación | 1. Basada en Cursor (Keyset).<br>2. Offset + Limit (`page` y `page_size`). | **Offset + Limit con conteo total** | El catálogo y el roadmap son listas finitas donde el usuario necesita saber la cantidad total de páginas y saltar libremente entre ellas (`Página 2 de 5`), lo cual el cursor no permite de forma natural. |
| **TD-003** | Formato de Errores de API | 1. Mensaje plano en texto crudo.<br>2. Esquema estándar tipo RFC 7807 (*Problem Details*). | **Envoltorio Estructurado RFC 7807 simplificado** | Respuestas uniformes con formato `{ "error": { "code": "...", "message": "...", "details": [...] } }`, permitiendo al frontend interceptar y asociar errores a campos específicos del formulario. |
| **TD-004** | Modelado del Roadmap Personal | 1. Columna JSONB con IDs de cursos en la tabla usuarios.<br>2. Tabla intermedia asociativa relacional. | **Tabla intermedia `roadmap_items`** | Garantiza integridad referencial mediante claves foráneas (`ON DELETE CASCADE`), indexación eficiente por usuario y modelado explícito de columnas de `orden` y `estado` (`por_empezar`, `en_progreso`, `completado`). |
| **TD-005** | Rate Limiting en Login | 1. Redis con ventana deslizante.<br>2. Middleware en memoria con algoritmo Token Bucket. | **Middleware en memoria (Slowapi / Leaky Bucket)** | Protege el endpoint crítico `/api/v1/auth/login` contra fuerza bruta (máximo 5 intentos por minuto por IP) cumpliendo la SPEC sin añadir dependencias externas de infraestructura en desarrollo. |

---

## 3. Arquitectura del Software

### 3.1 Patrón de Diseño y Capas (Screaming Architecture)

Tanto el backend como el frontend abandonan la división genérica por capas técnicas (*controllers*, *models*, *views*) y se estructuran **por dominios de negocio** (*courses*, *roadmaps*, *auth*, *categories*):

```mermaid
flowchart LR
    subgraph Cliente ["Frontend (React 19)"]
        UI[Componentes UI / Vistas] --> HOOKS[Custom Hooks de Dominio]
        HOOKS --> API_CLIENT[Cliente HTTP / Fetch]
    end

    subgraph Servidor ["Backend (FastAPI)"]
        API_CLIENT -- "HTTP / REST JSON" --> ROUTER[Routers / Controllers de Dominio]
        ROUTER --> SERVICE[Services — Reglas de Negocio Puras]
        SERVICE --> REPO[Repositories — Acceso a Datos]
        SERVICE --> SCHEMAS[Pydantic Schemas / DTOs]
    end

    subgraph Persistencia ["Base de Datos"]
        REPO -- "SQL Async" --> PG[(PostgreSQL 18.6)]
    end
```

- **Routers / Controllers:** Reciben peticiones HTTP, validan parámetros de entrada con Pydantic y delegan la ejecución. No contienen lógica de negocio ni sentencias SQL.
- **Services:** Encapsulan las reglas de negocio puras (ej. verificar si el curso está aprobado antes de añadirlo al roadmap, validar si la URL ya fue aportada, aplicar bcrypt a contraseñas). Son testeables de forma unitaria sin requerir conexión a base de datos.
- **Repositories:** Manejan exclusivamente la interacción con SQLAlchemy y PostgreSQL. No aplican reglas de negocio.

---

### 3.2 Estructura de Carpetas Prevista para la Instancia B

La estructura refleja la **Screaming Architecture**: al mirar el árbol, comunica de inmediato que se trata de una plataforma comunitaria de cursos y roadmaps:

```text
comunidad-cursos/
├── .gitignore
├── README.md
├── docker-compose.yml
├── docs/
│   ├── SPEC.md
│   ├── PRD.md
│   ├── TRD.md
│   ├── UX-UI.md
│   ├── APPFlow.md
│   ├── BackendSchema.md
│   └── IMPLEMENTATION_PLAN.md
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── app/
│   │   ├── main.py                     # Entrypoint de FastAPI y middlewares (CORS, Rate Limit)
│   │   ├── config.py                   # Variables de entorno y configuración general
│   │   ├── core/                       # Seguridad (JWT, hashing bcrypt, dependencias auth)
│   │   │   ├── security.py
│   │   │   └── database.py             # Sesión asíncrona de SQLAlchemy
│   │   ├── auth/                       # Dominio de autenticación y usuarios
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── schemas.py
│   │   ├── courses/                    # Dominio de catálogo y aportes comunitarios
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   ├── roadmaps/                   # Dominio de itinerarios personales de estudio
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   ├── models.py
│   │   │   └── schemas.py
│   │   └── categories/                 # Dominio de categorías temáticas
│   │       ├── router.py
│   │       ├── repository.py
│   │       └── models.py
│   └── tests/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── main.jsx
    │   ├── app/                        # Shell global, layout con header sticky y navegación
    │   │   ├── App.jsx
    │   │   ├── Router.jsx
    │   │   └── Header.jsx              # Menú sándwich mobile y nav desktop
    │   ├── styles/                     # Design tokens en variables CSS (:root)
    │   │   └── variables.css
    │   ├── shared/                     # Componentes agnósticos (Botón pill, Modal, Toast)
    │   │   └── components/
    │   └── features/                   # Módulos por dominio de negocio
    │       ├── auth/                   # Login, Registro, Recuperación
    │       ├── courses/                # Catálogo paginado, Card de curso, Formulario de aporte
    │       ├── roadmaps/               # Tablero de roadmap, cambio de estado de avance
    │       └── moderation/             # Bandeja de validación de aportes (Admin)
```

---

### 3.3 Servicios en Docker Compose (Entorno de Desarrollo)

```mermaid
flowchart LR
    USUARIO[Navegador Web :5173] --> FE_CONTAINER[Contenedor Frontend - Vite :5173]
    FE_CONTAINER -- "Llamadas /api/v1/*" --> BE_CONTAINER[Contenedor Backend - FastAPI :8000]
    BE_CONTAINER -- "asyncpg :5432" --> DB_CONTAINER[(Contenedor PostgreSQL 18.6 :5432)]
```

| Servicio | Imagen / Dockerfile Base | Puerto Host | Rol en el Sistema |
|----------|--------------------------|-------------|-------------------|
| **`postgres`** | `postgres:18.6` | `5432:5432` | Servidor de base de datos relacional con persistencia en volumen con nombre (`postgres_data`). |
| **`backend`** | `python:3.12-slim` + `uv` | `8000:8000` | API REST asíncrona FastAPI con hot-reload (`uvicorn --reload`). |
| **`frontend`** | `node:20-alpine` + `pnpm` | `5173:5173` | Servidor de desarrollo Vite con Hot Module Replacement (HMR). |

---

## 4. Convenciones de Desarrollo

- **Commits:** Conventional Commits estricto en español o inglés (`docs:`, `feat:`, `fix:`, `refactor:`, `chore:`, `test:`).
- **Flujo de Git (GitHub Flow):**
  - La rama `main` refleja el estado de entregables validados.
  - El trabajo se realiza en ramas descriptivas (`docs/...`, `feat/...`).
  - La integración se realiza mediante Pull Requests o `git merge --no-ff` para preservar el grafo auditable de ramas en GitHub.
- **Estructura de Errores de API:**
  ```json
  {
    "error": {
      "code": "COURSE_URL_DUPLICATED",
      "message": "La URL del curso ingresada ya existe en el catálogo o se encuentra en revisión.",
      "field": "url"
    }
  }
  ```
- **Variables de Entorno Principales:**

  | Variable | Ejemplo / Valor por Defecto | Obligatoria | Finalidad |
  |----------|-----------------------------|-------------|-----------|
  | `DATABASE_URL` | `postgresql+asyncpg://postgres:secret@postgres:5432/comunidad_cursos` | Sí | Cadena de conexión asíncrona a la base de datos. |
  | `JWT_SECRET_KEY` | `dev_secret_key_super_segura_para_firmar_tokens` | Sí | Semilla criptográfica para firma de tokens JWT. |
  | `JWT_ALGORITHM` | `HS256` | Sí | Algoritmo simétrico de firma. |
  | `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | No | Tiempo de vigencia del token de sesión. |
  | `CORS_ORIGINS` | `http://localhost:5173` | Sí | Orígenes autorizados para peticiones cruzadas. |

---

## 5. Requisitos No Funcionales Técnicos (Traducción de Restricciones)

| Restricción de la Consigna | Implementación Técnica | Dónde se Evidencia |
|----------------------------|------------------------|--------------------|
| **Paginación obligatoria** | Query parameters `page` (base 1) y `page_size` (máximo 50). Retorna objeto con `items`, `total`, `page` y `page_size`. | BackendSchema §3 y endpoints `/cursos`, `/roadmap`. |
| **Mobile-First con mejora progresiva** | Archivo `variables.css` y estilos base sin media queries para 360px. `@media (min-width: 768px)` y `@media (min-width: 1024px)` para grillas y visibilidad. | UX-UI §3 y código frontend en `src/styles`. |
| **Menú sándwich accesible** | Componente `<Header />` con estado colapsado por defecto, manejador de tecla `ESC` y atributos `aria-expanded` y `aria-controls`. | UX-UI §4.5 y APPFlow §3. |
| **Screaming Architecture** | Estructura modular de carpetas agrupadas por capacidades de negocio tanto en backend como en frontend. | TRD §3.2 y árbol de archivos. |

---

## 6. Riesgos Técnicos y Mitigaciones

| Riesgo Técnico Detectado | Probabilidad | Impacto | Estrategia de Mitigación |
|--------------------------|--------------|---------|--------------------------|
| Incompatibilidad de drivers asíncronos con PostgreSQL 18.6 | Baja | Alto | Utilizar la versión estable más reciente de `asyncpg` (`0.30+`) testeada con el protocolo de red de Postgres 18. |
| Degradación de rendimiento en consultas paginadas con cálculo de total | Media | Medio | Creación de índices compuestos sobre `estado` y `categoria_id` en la tabla `cursos`. |
| Inyección de enlaces fraudulentos o maliciosos | Media | Alto | Validación estricta de esquema URL (`http://` o `https://`) y filtro de moderación humana previa (rol `admin`). |

---

**Referencias:**
- Design Docs at Google (patrones de arquitectura y trade-offs): https://www.industrialempathy.com/posts/design-docs-at-google/
- FastAPI Best Practices & Project Structure: https://fastapi.tiangolo.com/tutorial/bigger-applications/
