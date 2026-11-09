from fastapi import FastAPI

app = FastAPI(
    title="ComunidadCursos API",
    description="API REST para la plataforma comunitaria de cursos y roadmaps",
    version="0.1.0"
)


@app.get("/health", tags=["Salud"])
async def health_check():
    """Endpoint de verificación de estado y salud del backend."""
    return {
        "status": "ok",
        "service": "comunidad-cursos-api",
        "version": "0.1.0"
    }
