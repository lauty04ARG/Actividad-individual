import React, { useState, useEffect } from 'react'

/**
 * Header de la aplicación con estrategia Mobile-First y Menú Sándwich.
 * Especificado en docs/UX-UI.md §4.5 y §5 (WCAG 2.1 AA).
 * 
 * En mobile (< 1024px): Muestra botón hamburguesa (44x44px target) y Drawer lateral con overlay.
 * En desktop (≥ 1024px): Oculta el sándwich y despliega la barra de navegación horizontalmente.
 */
export function Header({ onOpenUploadModal, onSelectView, currentView = 'catalogo' }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Manejo de accesibilidad: Cerrar Drawer con tecla Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  // Prevenir scroll en body cuando el drawer móvil está abierto
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  function handleNavigate(view) {
    if (onSelectView) {
      onSelectView(view)
    }
    setIsDrawerOpen(false)
  }

  function handleUploadClick() {
    setIsDrawerOpen(false)
    if (onOpenUploadModal) {
      onOpenUploadModal()
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="header-content">
          <div className="header-brand-group">
            {/* Botón Menú Sándwich (Mobile / Tablet < 1024px) */}
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label={isDrawerOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isDrawerOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>

            <a href="/" className="site-logo" onClick={(e) => { e.preventDefault(); handleNavigate('catalogo'); }}>
              ComunidadCursos
            </a>
            <span className="site-badge">v0.1.1-dev</span>
          </div>

          {/* Navegación Desktop Horizontal (≥ 1024px) */}
          <nav className="desktop-nav" aria-label="Navegación principal desktop">
            <button
              type="button"
              className={`nav-link ${currentView === 'catalogo' ? 'active' : ''}`}
              onClick={() => handleNavigate('catalogo')}
            >
              Catálogo
            </button>
            <button
              type="button"
              className={`nav-link ${currentView === 'roadmap' ? 'active' : ''}`}
              onClick={() => handleNavigate('roadmap')}
            >
              Mi Roadmap
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleUploadClick}
              style={{ marginLeft: 'var(--space-2)' }}
            >
              + Subir Curso (Admin)
            </button>
          </nav>
        </div>
      </header>

      {/* Drawer Móvil y Overlay con Backdrop */}
      <div
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="mobile-navigation-drawer"
        className={`drawer-panel ${isDrawerOpen ? 'open' : ''}`}
        aria-label="Menú de navegación móvil"
        aria-hidden={!isDrawerOpen}
      >
        <div className="drawer-header">
          <span className="drawer-title">Menú Principal</span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <div className="drawer-content">
          <ul className="drawer-list">
            <li>
              <button
                type="button"
                className={`drawer-link ${currentView === 'catalogo' ? 'active' : ''}`}
                onClick={() => handleNavigate('catalogo')}
              >
                <span className="drawer-icon">📚</span>
                Catálogo Comunitario
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`drawer-link ${currentView === 'roadmap' ? 'active' : ''}`}
                onClick={() => handleNavigate('roadmap')}
              >
                <span className="drawer-icon">🗺️</span>
                Mi Roadmap
              </button>
            </li>
            <li className="drawer-divider" />
            <li>
              <button
                type="button"
                className="drawer-link drawer-cta"
                onClick={handleUploadClick}
              >
                <span className="drawer-icon">➕</span>
                Subir Curso (Admin / Aporte)
              </button>
            </li>
          </ul>

          <div className="drawer-footer">
            <p><strong>ComunidadCursos</strong> · UTN FR La Plata</p>
            <p>Desarrollo de Software — S34</p>
          </div>
        </div>
      </nav>
    </>
  )
}
