import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

// Note: @vitejs/plugin-vue n'est pas nécessaire ici car les tests
// ne montent pas de composants Vue - ils testent uniquement les stores et l'API.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/stores/**', 'src/api/**'],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
  },
})
