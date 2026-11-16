FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar el gestor uv desde la imagen oficial de Astral
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copiar configuración de dependencias de uv
COPY pyproject.toml .python-version ./

# Instalar dependencias en el contenedor
RUN uv pip install --system fastapi "uvicorn[standard]" pydantic pydantic-settings sqlalchemy asyncpg

# Copiar el código fuente de la aplicación
COPY . .

EXPOSE 8000

# Servidor de desarrollo con recarga en caliente (hot-reload)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
