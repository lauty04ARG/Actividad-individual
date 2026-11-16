from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, status
from app.courses.schemas import CoursePaginationResponse, CourseResponse, CourseCreate, CategoriaResponse

router = APIRouter(prefix="/api/v1/cursos", tags=["Catálogo de Cursos"])

CATEGORIAS_MOCK = [
    CategoriaResponse(id=1, nombre="Desarrollo Backend", descripcion="APIs, servidores y arquitecturas asíncronas"),
    CategoriaResponse(id=2, nombre="DevOps e Infraestructura", descripcion="Contenedores, orquestación y CI/CD"),
    CategoriaResponse(id=3, nombre="Bases de Datos", descripcion="Modelado relacional, SQL y optimización"),
    CategoriaResponse(id=4, nombre="Desarrollo Frontend", descripcion="React 19, componentes y arquitectura web"),
]

# Semilla inicial enriquecida para probar paginación, filtros y búsqueda interactiva
CURSOS_MOCK: List[CourseResponse] = [
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
    ),
    CourseResponse(
        id=4,
        titulo="React 19 y Arquitectura por Características",
        tema="Desarrollo Frontend Moderno",
        url="https://react.dev/learn",
        categoria_id=4,
        version="19.0",
        anio_edicion=2026,
        docentes="Meta Open Source",
        tiene_cuestionarios=True,
        requiere_examen=False,
        extiende_certificado=False,
        aval_organizacion="React Community",
        declare_que_lo_tomo=True,
        estado="publicado",
        usuario_id=1
    ),
    CourseResponse(
        id=5,
        titulo="Arquitectura Hexagonal y Clean Architecture en Python",
        tema="Patrones de Diseño y Backend",
        url="https://github.com/cosmicpython/book",
        categoria_id=1,
        version="2.0",
        anio_edicion=2025,
        docentes="Harry Percival & Bob Gregory",
        tiene_cuestionarios=False,
        requiere_examen=False,
        extiende_certificado=True,
        aval_organizacion="O'Reilly Open",
        declare_que_lo_tomo=True,
        estado="publicado",
        usuario_id=1
    ),
    CourseResponse(
        id=6,
        titulo="Kubernetes para Principiantes: De Pods a Clusters",
        tema="Orquestación en la Nube",
        url="https://kubernetes.io/docs/tutorials/",
        categoria_id=2,
        version="1.31",
        anio_edicion=2026,
        docentes="Cloud Native Computing Foundation",
        tiene_cuestionarios=True,
        requiere_examen=True,
        extiende_certificado=True,
        aval_organizacion="The Linux Foundation",
        declare_que_lo_tomo=False,
        estado="publicado",
        usuario_id=2
    ),
    CourseResponse(
        id=7,
        titulo="Fundamentos de TypeScript para Desarrolladores React",
        tema="Tipado Estático en Frontend",
        url="https://www.typescriptlang.org/docs/handbook/intro.html",
        categoria_id=4,
        version="5.6",
        anio_edicion=2026,
        docentes="Microsoft Open Source",
        tiene_cuestionarios=False,
        requiere_examen=False,
        extiende_certificado=False,
        aval_organizacion="Microsoft",
        declare_que_lo_tomo=True,
        estado="publicado",
        usuario_id=1
    ),
    CourseResponse(
        id=8,
        titulo="Diseño de Índices y Rendimiento en SQL",
        tema="Optimización de Consultas",
        url="https://use-the-index-luke.com/",
        categoria_id=3,
        version="1.0",
        anio_edicion=2025,
        docentes="Markus Winand",
        tiene_cuestionarios=True,
        requiere_examen=False,
        extiende_certificado=False,
        aval_organizacion="SQL Index Academy",
        declare_que_lo_tomo=True,
        estado="publicado",
        usuario_id=2
    ),
]


@router.get("/categorias", response_model=List[CategoriaResponse])
async def list_categories():
    """Retorna las categorías maestras para filtros y carga de cursos."""
    return CATEGORIAS_MOCK


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(nuevo_curso: CourseCreate):
    """
    Permite cargar un nuevo curso desde el panel de administración o módulo de aportes.
    Aplica la regla de negocio BR-004: URLs únicas para evitar redundancias o duplicados.
    """
    url_limpia = str(nuevo_curso.url).strip()

    # Validación de unicidad de URL (BR-004)
    if any(c.url.strip() == url_limpia for c in CURSOS_MOCK):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un curso registrado en la comunidad con esa misma URL."
        )

    nuevo_id = max([c.id for c in CURSOS_MOCK], default=0) + 1

    curso_creado = CourseResponse(
        id=nuevo_id,
        titulo=nuevo_curso.titulo.strip(),
        tema=nuevo_curso.tema.strip(),
        url=url_limpia,
        categoria_id=nuevo_curso.categoria_id,
        version=nuevo_curso.version or "1.0",
        anio_edicion=nuevo_curso.anio_edicion,
        docentes=nuevo_curso.docentes.strip(),
        tiene_cuestionarios=nuevo_curso.tiene_cuestionarios,
        requiere_examen=nuevo_curso.requiere_examen,
        extiende_certificado=nuevo_curso.extiende_certificado,
        aval_organizacion=nuevo_curso.aval_organizacion,
        declare_que_lo_tomo=nuevo_curso.declare_que_lo_tomo,
        estado=nuevo_curso.estado or "publicado",
        usuario_id=1
    )

    # Insertamos al inicio para que el nuevo curso aparezca de inmediato en la primera página
    CURSOS_MOCK.insert(0, curso_creado)
    return curso_creado


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
        query_lower = q.lower().strip()
        cursos_filtrados = [
            c for c in cursos_filtrados
            if query_lower in c.titulo.lower() or query_lower in c.tema.lower() or query_lower in c.docentes.lower()
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
