import { useState, useEffect, useCallback } from 'react'
import { getCourses } from './api'

/**
 * Custom hook para gestionar la carga y ciclo de vida de cursos del catálogo.
 * Maneja de forma explícita los estados: loading, error, empty y ok.
 */
export function useCourses({ page = 1, pageSize = 10, categoriaId = null, query = '' } = {}) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, page, pageSize })

  const loadCourses = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getCourses({ page, pageSize, categoriaId, query })
      setCourses(data.items || [])
      setPagination({
        total: data.total || 0,
        page: data.page || page,
        pageSize: data.page_size || pageSize,
      })
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, categoriaId, query])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  return {
    courses,
    loading,
    error,
    isEmpty: !loading && !error && courses.length === 0,
    pagination,
    refetch: loadCourses,
  }
}
