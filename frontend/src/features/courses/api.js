/**
 * Cliente API para el dominio de cursos.
 * Consume los endpoints REST definidos en BackendSchema §3.2 a través del proxy de Vite.
 */

export async function getCourses({ page = 1, pageSize = 10, categoriaId = null, query = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  })

  if (categoriaId) {
    params.append('categoria_id', String(categoriaId))
  }

  if (query && query.trim()) {
    params.append('q', query.trim())
  }

  const response = await fetch(`/api/v1/cursos?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Error en el servidor al cargar cursos (HTTP ${response.status})`)
  }

  return await response.json()
}

export async function getCategories() {
  const response = await fetch('/api/v1/cursos/categorias')
  if (!response.ok) {
    throw new Error(`Error al cargar categorías (HTTP ${response.status})`)
  }
  return await response.json()
}

export async function createCourse(courseData) {
  const response = await fetch('/api/v1/cursos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Error al crear curso (HTTP ${response.status})`)
  }

  return await response.json()
}
