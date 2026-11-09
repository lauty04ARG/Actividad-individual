from typing import Optional, List
from pydantic import BaseModel, HttpUrl, Field


class CourseBase(BaseModel):
    """Esquema base de datos para un curso de la comunidad."""
    titulo: str = Field(..., max_length=200, description="Título descriptivo del curso")
    tema: str = Field(..., max_length=150, description="Temática específica")
    url: str = Field(..., max_length=2048, description="Enlace web activo")
    categoria_id: int = Field(..., description="ID de la categoría temática")
    version: Optional[str] = Field(None, max_length=50, description="Versión del curso o contenido")
    anio_edicion: int = Field(..., ge=2000, le=2030, description="Año de edición")
    docentes: str = Field(..., max_length=255, description="Docentes o institución dictante")
    tiene_cuestionarios: bool = Field(False, description="¿Cuenta con cuestionarios?")
    requiere_examen: bool = Field(False, description="¿Requiere examen?")
    extiende_certificado: bool = Field(False, description="¿Extiende certificado?")
    aval_organizacion: Optional[str] = Field(None, max_length=150, description="Organización que lo avala")
    declare_que_lo_tomo: bool = Field(..., description="Declaración obligatoria de si el autor cursó el contenido")


class CourseResponse(CourseBase):
    """Esquema de respuesta pública de curso en catálogo."""
    id: int
    estado: str = "publicado"
    usuario_id: int = 1

    model_config = {
        "from_attributes": True
    }


class CoursePaginationResponse(BaseModel):
    """Envelope estándar de paginación según BackendSchema §3."""
    items: List[CourseResponse]
    total: int
    page: int
    page_size: int
