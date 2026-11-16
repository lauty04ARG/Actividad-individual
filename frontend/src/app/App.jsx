import React, { useState } from 'react'
import { Header } from './Header'
import { CoursesList } from '../features/courses/CoursesList'
import { CourseFormModal } from '../features/courses/CourseFormModal'

export default function App() {
  const [currentView, setCurrentView] = useState('catalogo')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [catalogKey, setCatalogKey] = useState(0)

  function handleCourseCreated(newCourse) {
    // Forzamos actualización del listado para reflejar el curso recién creado
    setCatalogKey((prev) => prev + 1)
    setToastMessage(`¡Curso "${newCourse.titulo}" agregado al catálogo con éxito!`)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  return (
    <div>
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      <main className="main-content">
        {currentView === 'catalogo' && (
          <CoursesList
            key={catalogKey}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {currentView === 'roadmap' && (
          <section className="state-box">
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
              🗺️ Mi Roadmap Personal de Aprendizaje
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              En este tablero podrás secuenciar tus cursos guardados y actualizar su estado (Por empezar, En progreso, Completado).
            </p>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: 'var(--space-4)', backgroundColor: 'var(--color-hover-grey)', borderRadius: 'var(--radius-card)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                ℹ️ Tu roadmap personal se inicializa automáticamente al agregar cursos desde el catálogo.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentView('catalogo')}
              >
                Explorar Catálogo Comunitario
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Modal accesible para Subir/Aportar Curso (Admin) */}
      <CourseFormModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onCourseCreated={handleCourseCreated}
      />

      {/* Notificación Toast (UX-UI §4.7) */}
      {toastMessage && (
        <div className="toast-notification" role="status">
          ✅ {toastMessage}
        </div>
      )}
    </div>
  )
}
