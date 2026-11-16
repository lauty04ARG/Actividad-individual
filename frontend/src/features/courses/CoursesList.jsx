import React, { useState, useEffect } from 'react'
import { useCourses } from './useCourses'
import { CourseCard } from './CourseCard'
import { getCategories } from './api'

/**
 * Vista de Catálogo Comunitario de Cursos.
 * Cumple con las prácticas obligatorias de la cátedra:
 * - Mobile-First con mejora progresiva.
 * - Paginación interactiva obligatoria (botones Anterior / Siguiente / Números / Tamaño).
 * - Búsqueda de texto y filtros por categorías cerradas.
 * - Manejo explícito de 4 estados: Loading, Error, Empty, OK.
 */
export function CoursesList({ onOpenUploadModal }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(4) // 4 por página para evidenciar paginación de inmediato
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null)
  const [categories, setCategories] = useState([])

  const { courses, loading, error, isEmpty, pagination, refetch } = useCourses({
    page,
    pageSize,
    categoriaId: selectedCategoriaId,
    query: searchQuery,
  })

  // Carga de categorías para la barra de filtros
  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Error al cargar categorías:', err)
        setCategories([
          { id: 1, nombre: 'Backend' },
          { id: 2, nombre: 'DevOps' },
          { id: 3, nombre: 'Bases de Datos' },
          { id: 4, nombre: 'Frontend' },
        ])
      }
    }
    loadCats()
  }, [])

  function handleSearchChange(e) {
    setSearchQuery(e.target.value)
    setPage(1) // Reset a la primera página al buscar
  }

  function handleCategorySelect(catId) {
    setSelectedCategoriaId((prev) => (prev === catId ? null : catId))
    setPage(1) // Reset a la primera página al cambiar filtro
  }

  function handleClearFilters() {
    setSearchQuery('')
    setSelectedCategoriaId(null)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(pagination.total / pageSize))

  return (
    <section>
      {/* Encabezado y Barra de Acción */}
      <div className="catalog-header">
        <div>
          <h2 className="catalog-title">Catálogo Comunitario de Cursos</h2>
          <p className="catalog-subtitle">
            Recursos abiertos validados por estudiantes y docentes.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm cta-upload-btn"
          onClick={onOpenUploadModal}
        >
          + Subir Curso (Admin)
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="filter-panel">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            className="search-input"
            placeholder="Buscar por título, tecnología o docente..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Buscar cursos en el catálogo"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => { setSearchQuery(''); setPage(1); }}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros de Categoría tipo Pills */}
        <div className="category-pills" role="toolbar" aria-label="Filtro de categorías">
          <button
            type="button"
            className={`pill-btn ${selectedCategoriaId === null ? 'active' : ''}`}
            onClick={() => handleCategorySelect(null)}
          >
            Todas ({pagination.total})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`pill-btn ${selectedCategoriaId === cat.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Estado: Cargando */}
      {loading && (
        <div className="state-box state-loading" role="status">
          <p>Conectando con el backend y cargando cursos...</p>
        </div>
      )}

      {/* Estado: Error */}
      {error && (
        <div className="state-box state-error" role="alert">
          <p style={{ marginBottom: 'var(--space-3)' }}>⚠️ {error}</p>
          <button onClick={refetch} className="btn btn-outline">
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* Estado: Vacío */}
      {isEmpty && (
        <div className="state-box" role="status">
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
            No se encontraron cursos publicados con estos filtros.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Probá ajustando la búsqueda o sé el primero en subir un contenido nuevo.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <button onClick={handleClearFilters} className="btn btn-outline">
              Limpiar Filtros
            </button>
            <button onClick={onOpenUploadModal} className="btn btn-primary">
              + Subir un Curso
            </button>
          </div>
        </div>
      )}

      {/* Estado: Datos OK */}
      {!loading && !error && courses.length > 0 && (
        <>
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Barra de Paginación Interactiva Obligatoria */}
          <nav className="pagination-bar" aria-label="Navegación de páginas">
            <div className="pagination-info">
              Mostrando página <strong>{page}</strong> de <strong>{totalPages}</strong> ({pagination.total} cursos en total)
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                className="btn btn-outline btn-pagination"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Página anterior"
              >
                ← Anterior
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`btn-page-number ${page === num ? 'active' : ''}`}
                    onClick={() => setPage(num)}
                    aria-label={`Ir a la página ${num}`}
                    aria-current={page === num ? 'page' : undefined}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-outline btn-pagination"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Página siguiente"
              >
                Siguiente →
              </button>
            </div>

            <div className="pagination-size-select">
              <label htmlFor="pageSizeSelect">Cursos por página:</label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
              >
                <option value={4}>4 por pág</option>
                <option value={6}>6 por pág</option>
                <option value={10}>10 por pág</option>
              </select>
            </div>
          </nav>
        </>
      )}
    </section>
  )
}
