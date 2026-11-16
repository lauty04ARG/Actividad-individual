# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [v0.1.0] - 2026-10-27

### Added
- Scaffold del proyecto: estructura de carpetas backend y frontend bajo patrón Screaming Architecture.
- Plantilla de variables de entorno `.env.example` para PostgreSQL 18.6, FastAPI y React.
- Backend mínimo en FastAPI + uv con endpoints `GET /health` y `GET /api/v1/cursos` paginado.
- Configuración de conexión asíncrona a base de datos PostgreSQL 18.6 con SQLAlchemy y asyncpg.
- Middleware de CORS configurado en backend para admitir peticiones desde el servidor de desarrollo de Vite.
- Frontend mínimo en React 19 + Vite + pnpm con proxy inverso de desarrollo hacia el backend en `vite.config.js`.
- Incorporación de tokens visuales (Google Material) y estilos globales con enfoque Mobile-First según `UX-UI.md`.
- Componente de catálogo comunitario que consume la API mediante custom hook con gestión explícita de estados (`loading`, `error`, `empty` y `ok`).
- Orquestación en Docker Compose para desarrollo local con 3 servicios: `postgres:18.6`, `backend` y `frontend`.
- Documentación de instrucciones verificables paso a paso para levantar en máquina limpia en `README.md`.
