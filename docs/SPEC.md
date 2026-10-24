# SPEC — ComunidadCursos

> **Qué es este documento:** versión refinada de la SPEC de clase para la WebApp de Gestión de Comunidad de Cursos.
> El repositorio comenzó con la SPEC de clase **tal cual** (primer commit en `main`). Este archivo representa su evolución formal: mantiene los requisitos originales, resuelve las ambigüedades detectadas y explicita las decisiones de producto y arquitectura tomadas.
> **Cuándo está bien:** cualquier integrante del equipo o docente que no haya estado en la clase del 20/10 comprende el producto completo leyendo este documento, y puede rastrear el origen de cada decisión técnica y funcional.

---

## 1. Identidad del producto

- **Nombre propio:** **ComunidadCursos**
- **Una línea:** Plataforma web comunitaria para descubrir cursos gratuitos validados de diversas fuentes y estructurar rutas personales de aprendizaje (roadmaps).

---

## 2. Problema

Hoy en día existe una enorme oferta de cursos y recursos formativos gratuitos distribuidos en múltiples plataformas (YouTube, edX, Coursera, repositorios comunitarios, plataformas universitarias). Sin embargo, los estudiantes universitarios y autodidactas enfrentan tres problemas recurrentes:

1. **Dispersión y falta de curaduría:** Es difícil saber si un curso gratuito sigue vigente, si tiene evaluaciones o si la persona que lo recomienda realmente lo cursó.
2. **Falta de orden secuencial:** Aprender una tecnología o disciplina suele requerir encadenar varios cursos temáticos, pero no existen herramientas sencillas para armar un itinerario personal de estudio ordenado sin caer en plataformas cerradas o de pago.
3. **Poco incentivo colaborativo:** Quienes descubren buenos materiales no disponen de un espacio unificado y abierto para compartirlos con metadatos claros (si entrega certificado, año de edición, requisitos, etc.) para que otros puedan aprovecharlos.

**ComunidadCursos** resuelve esto creando un catálogo centralizado donde los estudiantes aportan recursos, una validación rápida asegura la calidad de los enlaces y cada usuario organiza su propio roadmap con seguimiento de estado.

---

## 3. Visión

Consolidarse como la plataforma de referencia en el ámbito académico para descubrir contenidos educativos abiertos y de calidad, permitiendo a los estudiantes planificar itinerarios de estudio completos y compartir sus trayectos con la comunidad.

---

## 4. Alcance

### Dentro del alcance (MVP / Instancia B)

- **Catálogo comunitario:** Exploración pública de cursos gratuitos validados, con paginación, búsqueda por palabras clave y filtro por categorías cerradas.
- **Aporte de cursos:** Formulario para que usuarios autenticados carguen cursos con metadatos completos (URL activa, título, tema, versión, año, docentes, flags de cuestionarios/examen/certificado/aval) y la declaración obligatoria de cursada previa.
- **Ciclo de validación:** Transición de estados de los aportes (`en_revision` → `publicado` o `rechazado`) a través de un panel de moderación accesible por administradores.
- **Roadmap personal de aprendizaje:** Capacidad de cada usuario de agregar cursos del catálogo a su propio tablero, asignarles un orden de prelación y marcar su estado (`por_empezar`, `en_progreso`, `completado`).
- **Autenticación y seguridad:** Registro con email/contraseña, login protegido con rate limiting, contraseñas hasheadas con bcrypt y flujo de recuperación de contraseña vía token.

### Fuera de alcance (Out of scope explícito)

- **Cursos arancelados o pasarelas de pago:** La plataforma solo admite contenidos 100% gratuitos y de libre acceso.
- **Streaming o alojamiento de video interno:** No se alojan archivos multimedia; el sistema referencia enlaces externos activos donde reside el material original.
- **Emisión de certificados propios:** La plataforma no acredita competencias; solo registra si la institución proveedora del curso otorga o no certificado.
- **Aplicación móvil nativa:** Se desarrolla exclusivamente como WebApp responsive para navegadores móviles y de escritorio.
- **Chat en tiempo real o foros de discusión complejos:** La interacción se limita al aporte, calificación indirecta y curaduría de cursos.

---

## 5. Reglas de producto clave

| # | Regla | Origen |
|---|-------|--------|
| **BR-001** | Un curso aportado entra con estado `en_revision` y solo pasa al catálogo comunitario tras ser aprobado por un usuario con rol moderador/admin. | SPEC de clase ("cursos cargados y **validados** pasan al catálogo") |
| **BR-002** | Cada usuario gestiona exclusivamente su propio roadmap personal de forma privada. | Decisión de producto (autonomía del estudiante) |
| **BR-003** | Quien aporta un curso debe declarar explícitamente mediante un campo booleano obligatorio si tomó o no dicho curso. | SPEC de clase ("el usuario que carga deberá informar si él tomó el curso aportado o no") |
| **BR-004** | No se permite la carga de cursos con URLs duplicadas que ya se encuentren en revisión o publicadas en el catálogo. | Decisión de producto (evitar redundancia en el catálogo) |
| **BR-005** | Solo se pueden agregar a un roadmap personal aquellos cursos que se encuentren en estado `publicado`. | Decisión de producto (garantía de calidad y enlaces vigentes) |

---

## 6. Stack registrado (versiones base para desarrollo)

| Capa | Tecnología | Versión base | Justificación / Nota |
|------|------------|--------------|----------------------|
| **Frontend** | React + Vite + pnpm | React 19.x · Vite 6.x · pnpm 10.x | Fijado por la consigna; React 19 con soporte para hooks modernos y renderizado eficiente sin librerías pesadas. |
| **Backend** | FastAPI + uv | FastAPI 0.115.x · uv 0.5.x | Fijado por la consigna (ref. cátedra `0.158.2` / Python 3.12). Alto rendimiento asíncrono y generación automática de OpenAPI. |
| **Base de datos** | PostgreSQL | 18.6 | Versión estipulada por la SPEC de clase, ejecutada sobre imagen oficial de Docker. |
| **Infraestructura dev** | Docker + Docker Compose | Docker Compose v2 (última stable) | Orquestación reproducible de frontend, backend y PostgreSQL para entorno local sin dependencias del SO host. |

---

## 7. Restricciones técnicas heredadas de la SPEC de clase

| # | Restricción | Cómo la vamos a cumplir |
|---|-------------|-------------------------|
| **1** | **Mobile-first con mejora progresiva** | La hoja de estilos base se diseña sin media queries para pantallas de 360px en una sola columna; se utiliza `@media (min-width: ...)` exclusivamente para expandir a grillas de 2 y 3 columnas en tablet y desktop. |
| **2** | **Paginación de todas las consultas de listado y tablas** | Los endpoints de listado (`/cursos`, `/roadmap`) implementan paginación por limit y offset (`?page=1&page_size=10`), devolviendo total de elementos y metadatos de navegación; el frontend renderiza un componente de paginación explícito. |
| **3** | **Menú sándwich en mobile** | El header de la aplicación colapsa la navegación en un menú desplegable accesible con icono hamburguesa en resoluciones < 768px, con soporte de teclado y atributos ARIA. |
| **4** | **Screaming Architecture** | Tanto el frontend como el backend organizan sus archivos por dominios de negocio (`courses/`, `roadmaps/`, `auth/`, `categories/`) y no por tipo de artefacto genérico. |
| **5** | **Estética inspirada en Google (Material)** | Paleta sobria basada en azul primario (`#1a73e8`), fondos claros (`#ffffff` / `#f8f9fa`), tarjetas con bordes redondeados (`8px`), sombras sutiles y jerarquía tipográfica limpia. |

---

## 8. Vacíos de la SPEC de clase y decisiones tomadas

| # | Vacío detectado en la SPEC | Opciones consideradas | Decisión tomada | Dónde se desarrolla |
|---|----------------------------|-----------------------|-----------------|---------------------|
| **1** | **¿Quién y cómo se valida un curso aportado?** | a) Aprobación automática sin filtro.<br>b) Votación comunitaria (tipo Reddit).<br>c) Rol administrador/moderador que aprueba o rechaza. | **Opción C:** Se define un rol `admin` con un endpoint dedicado (`POST /api/v1/aportes/{id}/validar`) para mantener el catálogo limpio y confiable en el MVP. | PRD §7 (BR-001) / BackendSchema §2 y §3.3 |
| **2** | **¿Qué roles de usuario existen?** | a) Rol único.<br>b) Estudiante y Administrador.<br>c) Roles múltiples (estudiante, docente, moderador, admin). | **Opción B:** Dos roles simples: `estudiante` (registro público, aporta y crea roadmaps) y `admin` (supervisa catálogo). | PRD §3 / TRD §2 (TD-001) |
| **3** | **¿Qué es técnicamente "incluir en mi roadmap"?** | a) Un array de IDs en la tabla de usuarios.<br>b) Tabla intermedia relacional con metadatos de avance. | **Opción B:** Tabla intermedia `roadmap_items` vinculando `usuario_id` y `curso_id`, con columnas de `orden` secuencial y `estado` (`por_empezar`, `en_progreso`, `completado`). | TRD §2 (TD-004) / BackendSchema §1 |
| **4** | **¿Cómo opera la búsqueda y los filtros del catálogo?** | a) Búsqueda solo en el cliente (frontend).<br>b) Filtros combinados en base de datos vía query params. | **Opción B:** El backend recibe `q` (búsqueda insensible a mayúsculas sobre título y tema) y `categoria_id`, devolviendo resultados paginados. | BackendSchema §3.2 / APPFlow §3 |
| **5** | **¿Qué ocurre ante URLs repetidas?** | a) Permitir duplicados con diferentes aportantes.<br>b) Restricción de unicidad estricta sobre la URL. | **Opción B:** `UNIQUE constraint` en la base de datos sobre el campo `url`. Si ya existe, se informa al usuario evitando spam y duplicación de esfuerzos. | BackendSchema §1.2 |
| **6** | **¿Cómo se resuelve el ciclo de recuperación de contraseña sin servicio de email de pago?** | a) Servicio SMTP comercial (SendGrid).<br>b) Flujo con token seguro devuelto/impreso en logs de desarrollo. | **Opción B:** Generación de token temporal de reseteo (`reset_token`) almacenado con expiración; en dev se registra en consola para completar el formulario `/reset-password?token=...`. | PRD §4 (US-006) / BackendSchema §3.1 |

---

## 9. Historia de la SPEC (registro de cambios)

| Fecha | Cambio | Por qué |
|-------|--------|---------|
| 20/10/2026 | Borrador inicial de la SPEC en pizarrón de clase. | Relevamiento preliminar en aula. |
| 21/10/2026 | Primer commit del repositorio con la `SPEC.md` de cátedra idéntica. | Cumplimiento de la regla metodológica de la consigna. |
| 24/10/2026 | Refinamiento y formalización completa de la SPEC (`docs/SPEC.md`). | Resolución explícita de vacíos de producto (validación, roles, modelo de roadmap, stack, restricciones). |
