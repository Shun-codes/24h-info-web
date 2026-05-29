import { vi } from 'vitest'

// Permet l'assignment de window.location.href en jsdom
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
  configurable: true,
})

// Réinitialise localStorage entre les tests
beforeEach(() => {
  localStorage.clear()
  window.location.href = ''
})
