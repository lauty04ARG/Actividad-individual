import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Permite conexiones desde el host y dentro de Docker Compose
    proxy: {
      // Redirige llamadas /api/* al backend FastAPI en http://localhost:8000
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
