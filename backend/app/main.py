from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.courses.router import router as courses_router

app = FastAPI(
    title="ComunidadCursos API",
    description="API REST para la plataforma comunitaria de cursos gratuitos y roadmaps personales",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de Middleware CORS para permitir peticiones desde el frontend (Vite :5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de routers por dominio de negocio (Screaming Architecture)
app.include_router(courses_router)


@app.get("/health", tags=["Salud"])
async def health_check():
    """Endpoint de verificación de estado y salud del backend."""
    return {
        "status": "ok",
        "service": "comunidad-cursos-api",
        "version": "0.1.0",
        "environment": settings.ENVIRONMENT
    }
