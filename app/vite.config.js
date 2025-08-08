import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
    css: true,
    coverage: { provider: 'v8', reporter: ['text', 'html'] }
  },
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist' }
})
