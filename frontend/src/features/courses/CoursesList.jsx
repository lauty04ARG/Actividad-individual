import React from 'react'
import { useCourses } from './useCourses'
import { CourseCard } from './CourseCard'

/**
 * Vista de catálogo de cursos comunitarios.
 * Implementa el manejo explícito de los estados loading, error, empty y ok.
 */
export function CoursesList() {
  const { courses, loading, error, isEmpty, pagination, refetch } = useCourses({
    page: 1,
    pageSize: 10,
  })

  return (
    <section>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
          Catálogo Comunitario de Cursos
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Cursos gratuitos aportados y validados por la comunidad académica.
        </p>
      </div>

      {/* Estado: Cargando */}
      {loading && (
        <div className="state-box state-loading">
          <p>Conectando con el backend y cargando cursos...</p>
        </div>
      )}

      {/* Estado: Error */}
      {error && (
        <div className="state-box state-error">
          <p style={{ marginBottom: 'var(--space-3)' }}>⚠️ {error}</p>
          <button onClick={refetch} className="btn btn-outline">
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* Estado: Vacío */}
      {isEmpty && (
        <div className="state-box">
          <p style={{ marginBottom: 'var(--space-2)' }}>
            No se encontraron cursos publicados en este momento.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Sé el primero en aportar un curso a la comunidad.
          </p>
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

          <div
            style={{
              marginTop: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)',
            }}
          >
            Página {pagination.page} de {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))} &bull; Total: {pagination.total} cursos registrados
          </div>
        </>
      )}
    </section>
  )
}
