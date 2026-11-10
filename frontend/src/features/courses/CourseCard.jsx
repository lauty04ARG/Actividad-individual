import React from 'react'

/**
 * Tarjeta de Curso individual.
 * Diseñada según las especificaciones de UX-UI.md §4.3.
 */
export function CourseCard({ course }) {
  return (
    <article className="course-card">
      <div>
        <span className="course-category">Categoría #{course.categoria_id}</span>
        <h3 className="course-title">{course.titulo}</h3>
        <p className="course-meta">
          <strong>Tema:</strong> {course.tema} &bull; <strong>Año:</strong> {course.anio_edicion}
        </p>
        <p className="course-meta">
          <strong>Docente:</strong> {course.docentes}
        </p>

        <div className="badges-container">
          {course.declare_que_lo_tomo ? (
            <span className="badge badge-success">✓ Cursado por el autor</span>
          ) : (
            <span className="badge badge-info">Recomendado sin cursar</span>
          )}

          {course.extiende_certificado && (
            <span className="badge badge-info">Certificado</span>
          )}
          {course.requiere_examen && (
            <span className="badge badge-info">Examen</span>
          )}
          {course.tiene_cuestionarios && (
            <span className="badge badge-info">Cuestionarios</span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ width: '100%' }}
        >
          Ver Curso Externo ↗
        </a>
      </div>
    </article>
  )
}
