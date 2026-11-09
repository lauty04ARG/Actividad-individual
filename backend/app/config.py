from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Configuración global de la aplicación cargada desde variables de entorno."""

    # Base de Datos (PostgreSQL 18.6)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/comunidad_cursos"

    # Servidor y Entorno
    BACKEND_PORT: int = 8000
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:5173"

    # Seguridad y JWT
    JWT_SECRET_KEY: str = "dev_secret_key_super_segura_para_firmar_tokens_1234567890"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
