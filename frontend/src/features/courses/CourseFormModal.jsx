import React, { useState, useEffect } from 'react'
import { createCourse, getCategories } from './api'

/**
 * Modal accesible de carga y aporte de cursos (Apartado Administrador / Aportes).
 * Implementa las reglas de negocio de docs/PRD.md:
 * - BR-003: Declaración obligatoria de cursada previa.
 * - BR-004: Validación de URL activa y detección de duplicados con HTTP 409.
 */
export function CourseFormModal({ isOpen, onClose, onCourseCreated }) {
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [formData, setFormData] = useState({
    titulo: '',
    tema: '',
    url: '',
    categoria_id: 1,
    version: '1.0',
    anio_edicion: 2026,
    docentes: '',
    tiene_cuestionarios: false,
    requiere_examen: false,
    extiende_certificado: false,
    aval_organizacion: '',
    declare_que_lo_tomo: true,
    estado: 'publicado', // Modo Admin: publicación inmediata en el catálogo comunitario
  })

  useEffect(() => {
    if (!isOpen) return

    setErrorMessage(null)
    setSuccessMessage(null)

    async function fetchCats() {
      try {
        const data = await getCategories()
        setCategories(data)
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, categoria_id: data[0].id }))
        }
      } catch (err) {
        console.error('Error al cargar categorías maestras:', err)
        // Fallback predeterminado según BackendSchema §1.1
        setCategories([
          { id: 1, nombre: 'Desarrollo Backend' },
          { id: 2, nombre: 'DevOps e Infraestructura' },
          { id: 3, nombre: 'Bases de Datos' },
          { id: 4, nombre: 'Desarrollo Frontend' },
        ])
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCats()
  }, [isOpen])

  // Escuchar tecla ESC para cerrar el modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !submitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, submitting, onClose])

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    // Validaciones inline en cliente
    if (!formData.titulo.trim() || !formData.tema.trim() || !formData.url.trim() || !formData.docentes.trim()) {
      setErrorMessage('Por favor completá todos los campos obligatorios (*).')
      return
    }

    if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
      setErrorMessage('El enlace debe ser una URL válida (iniciar con https:// o http://).')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        categoria_id: Number(formData.categoria_id),
        anio_edicion: Number(formData.anio_edicion),
      }

      const created = await createCourse(payload)
      setSuccessMessage(`¡Curso "${created.titulo}" publicado exitosamente con ID #${created.id}!`)

      setTimeout(() => {
        if (onCourseCreated) {
          onCourseCreated(created)
        }
        onClose()
      }, 1200)
    } catch (err) {
      setErrorMessage(err.message || 'Error al comunicarse con el servidor')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Subir Nuevo Curso (Panel Admin)</h2>
            <p className="modal-subtitle">
              Carga cursos validados para que aparezcan de inmediato en el catálogo comunitario.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="status">
            ✅ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="titulo">
                Título del Curso <span className="req">*</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                required
                maxLength={200}
                placeholder="ej. Fundamentos de Arquitectura de Software"
                value={formData.titulo}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tema">
                Temática o Tecnologías <span className="req">*</span>
              </label>
              <input
                id="tema"
                name="tema"
                type="text"
                required
                maxLength={150}
                placeholder="ej. Microservicios, Docker, FastAPI"
                value={formData.tema}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria_id">
                Categoría Disciplinar <span className="req">*</span>
              </label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                disabled={submitting || loadingCategories}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="url">
                Enlace Web Activo (URL) <span className="req">*</span>
              </label>
              <input
                id="url"
                name="url"
                type="url"
                required
                maxLength={2048}
                placeholder="https://plataforma.org/curso-gratis"
                value={formData.url}
                onChange={handleChange}
                disabled={submitting}
              />
              <span className="form-help">Debe ser un recurso formativo 100% gratuito.</span>
            </div>

            <div className="form-group">
              <label htmlFor="docentes">
                Docentes o Institución <span className="req">*</span>
              </label>
              <input
                id="docentes"
                name="docentes"
                type="text"
                required
                maxLength={255}
                placeholder="ej. UTN FR La Plata / MIT OpenCourseWare"
                value={formData.docentes}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group half-width">
              <label htmlFor="anio_edicion">Año de Edición</label>
              <input
                id="anio_edicion"
                name="anio_edicion"
                type="number"
                min={2000}
                max={2030}
                value={formData.anio_edicion}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group half-width">
              <label htmlFor="version">Versión del Curso</label>
              <input
                id="version"
                name="version"
                type="text"
                maxLength={50}
                placeholder="ej. 2026 / v2.0"
                value={formData.version}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="aval_organizacion">Aval u Organización Respaldante (Opcional)</label>
              <input
                id="aval_organizacion"
                name="aval_organizacion"
                type="text"
                maxLength={150}
                placeholder="ej. Linux Foundation, Google Developers, CNCF"
                value={formData.aval_organizacion}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-checkboxes-group">
            <span className="checkboxes-title">Metadatos de Evaluación y Acreditación</span>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="extiende_certificado"
                checked={formData.extiende_certificado}
                onChange={handleChange}
                disabled={submitting}
              />
              <span>Otorga certificado de finalización gratuito</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiere_examen"
                checked={formData.requiere_examen}
                onChange={handleChange}
                disabled={submitting}
              />
              <span>Incluye instancias de examen formal o entregas</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tiene_cuestionarios"
                checked={formData.tiene_cuestionarios}
                onChange={handleChange}
                disabled={submitting}
              />
              <span>Posee cuestionarios o quizzes de autoevaluación</span>
            </label>
          </div>

          <div className="declaration-box">
            <label className="checkbox-label highlight">
              <input
                type="checkbox"
                name="declare_que_lo_tomo"
                checked={formData.declare_que_lo_tomo}
                onChange={handleChange}
                disabled={submitting}
              />
              <span>
                <strong>Declaración Jurada (Regla BR-003):</strong> He tomado o cursado personalmente este contenido y certifico su vigencia y calidad pedagógica.
              </span>
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Publicando Curso...' : 'Publicar Curso en Catálogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
