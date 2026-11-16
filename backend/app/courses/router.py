from typing import Optional
from fastapi import APIRouter, Query
from app.courses.schemas import CoursePaginationResponse, CourseResponse

router = APIRouter(prefix="/api/v1/cursos", tags=["Catálogo de Cursos"])

# Datos iniciales para satisfacer el scaffold mínimo del Ticket 2
CURSOS_MOCK = [
    CourseResponse(
        id=1,
        titulo="FastAPI y Python Asíncrono desde Cero",
        tema="Desarrollo Backend Moderno",
        url="https://fastapi.tiangolo.com/tutorial/",
        categoria_id=1,
        version="0.115",
        anio_edicion=2026,
        docentes="Comunidad Oficial FastAPI",
        tiene_cuestionarios=True,
        requiere_examen=False,
        extiende_certificado=False,
        aval_organizacion="Linux Foundation",
        declare_que_lo_tomo=True,
        estado="publicado",
        usuario_id=1
    ),
    CourseResponse(
        id=2,
        titulo="Docker y Contenedores para Desarrolladores",
        tema="DevOps e Infraestructura",
        url="https://docs.docker.com/get-started/",
        categoria_id=2,
        version="v27",
        anio_edicion=2026,
        docentes="Docker Inc.",
        tiene_cuestionarios=False,
        requiere_examen=False,
        extiende_certificado=False,
        aval_organizacion="CNCF",
        declare_que_lo_tomo=True,
        estado="publicado",
        usuario_id=1
    ),
    CourseResponse(
        id=3,
        titulo="PostgreSQL 18: Modelado Relacional y Optimización",
        tema="Bases de Datos Relacionales",
        url="https://www.postgresql.org/docs/18/",
        categoria_id=3,
        version="18.6",
        anio_edicion=2026,
        docentes="PostgreSQL Global Development Group",
        tiene_cuestionarios=True,
        requiere_examen=True,
        extiende_certificado=True,
        aval_organizacion="PostgreSQL Foundation",
        declare_que_lo_tomo=False,
        estado="publicado",
        usuario_id=2
    )
]


@router.get("", response_model=CoursePaginationResponse)
async def list_courses(
    page: int = Query(1, ge=1, description="Número de página (base 1)"),
    page_size: int = Query(10, ge=1, le=50, description="Cantidad de elementos por página"),
    categoria_id: Optional[int] = Query(None, description="Filtro opcional por ID de categoría"),
    q: Optional[str] = Query(None, description="Término de búsqueda textual por título o tema")
):
    """
    Endpoint del catálogo comunitario de cursos validados y publicados.
    Cumple con la paginación y filtrado obligatorio según BackendSchema §3.2.
    """
    cursos_filtrados = CURSOS_MOCK

    if categoria_id is not None:
        cursos_filtrados = [c for c in cursos_filtrados if c.categoria_id == categoria_id]

    if q:
        query_lower = q.lower()
        cursos_filtrados = [
            c for c in cursos_filtrados
            if query_lower in c.titulo.lower() or query_lower in c.tema.lower()
        ]

    total = len(cursos_filtrados)
    start = (page - 1) * page_size
    end = start + page_size
    items = cursos_filtrados[start:end]

    return CoursePaginationResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )
