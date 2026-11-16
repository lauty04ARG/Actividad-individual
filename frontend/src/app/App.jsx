import React from 'react'
import { CoursesList } from '../features/courses/CoursesList'

export default function App() {
  return (
    <div>
      <header className="site-header">
        <div className="header-content">
          <a href="/" className="site-logo">
            ComunidadCursos
          </a>
          <span className="site-badge">v0.1.0-dev</span>
        </div>
      </header>

      <main className="main-content">
        <CoursesList />
      </main>
    </div>
  )
}
