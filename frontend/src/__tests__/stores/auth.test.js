import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/api/auth.js')

import * as authApi from '@/api/auth.js'
import { useAuthStore } from '@/stores/auth.js'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('état initial', () => {
    it('lit le token depuis localStorage à l\'initialisation', () => {
      localStorage.setItem('lunivert_token', 'token.stocké')
      const store = useAuthStore()
      expect(store.token).toBe('token.stocké')
    })

    it('lit l\'utilisateur depuis localStorage à l\'initialisation', () => {
      const user = { id: 1, name: 'Alice', role: 'user' }
      localStorage.setItem('lunivert_user', JSON.stringify(user))
      const store = useAuthStore()
      expect(store.user).toEqual(user)
    })

    it('a un token null quand localStorage est vide', () => {
      const store = useAuthStore()
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
    })
  })

  describe('propriétés calculées', () => {
    it('isAuthenticated est true quand le token est défini', () => {
      localStorage.setItem('lunivert_token', 'un.token')
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(true)
    })

    it('isAuthenticated est false quand pas de token', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('isAdmin est true quand le rôle est admin', () => {
      localStorage.setItem('lunivert_user', JSON.stringify({ role: 'admin' }))
      const store = useAuthStore()
      expect(store.isAdmin).toBe(true)
    })

    it('isAdmin est false pour les rôles non-admin', () => {
      localStorage.setItem('lunivert_user', JSON.stringify({ role: 'user' }))
      const store = useAuthStore()
      expect(store.isAdmin).toBe(false)
    })

    it('isAdmin est false quand user est null', () => {
      const store = useAuthStore()
      expect(store.isAdmin).toBe(false)
    })

    it('isModerator est true pour le rôle admin', () => {
      localStorage.setItem('lunivert_user', JSON.stringify({ role: 'admin' }))
      const store = useAuthStore()
      expect(store.isModerator).toBe(true)
    })

    it('isModerator est true pour le rôle moderator', () => {
      localStorage.setItem('lunivert_user', JSON.stringify({ role: 'moderator' }))
      const store = useAuthStore()
      expect(store.isModerator).toBe(true)
    })

    it('isModerator est false pour un utilisateur normal', () => {
      localStorage.setItem('lunivert_user', JSON.stringify({ role: 'user' }))
      const store = useAuthStore()
      expect(store.isModerator).toBe(false)
    })
  })

  describe('login', () => {
    it('persiste le token et l\'utilisateur dans l\'état et localStorage', async () => {
      const responseData = { token: 'nouveau.token', user: { id: 1, name: 'Alice' } }
      authApi.login.mockResolvedValue({ data: responseData })
      const store = useAuthStore()

      await store.login({ email: 'a@b.com', password: 'pass' })

      expect(store.token).toBe('nouveau.token')
      expect(store.user).toEqual({ id: 1, name: 'Alice' })
      expect(localStorage.getItem('lunivert_token')).toBe('nouveau.token')
      expect(JSON.parse(localStorage.getItem('lunivert_user'))).toEqual({ id: 1, name: 'Alice' })
    })

    it('appelle l\'API avec les identifiants fournis', async () => {
      authApi.login.mockResolvedValue({ data: { token: 't', user: {} } })
      const store = useAuthStore()
      const credentials = { email: 'a@b.com', password: 'secret' }

      await store.login(credentials)

      expect(authApi.login).toHaveBeenCalledWith(credentials)
    })
  })

  describe('register', () => {
    it('persiste le token et l\'utilisateur après inscription', async () => {
      const responseData = { token: 'reg.token', user: { id: 2, name: 'Bob' } }
      authApi.register.mockResolvedValue({ data: responseData })
      const store = useAuthStore()

      await store.register({ email: 'b@b.com', password: 'pass123', name: 'Bob' })

      expect(store.token).toBe('reg.token')
      expect(store.user).toEqual({ id: 2, name: 'Bob' })
      expect(localStorage.getItem('lunivert_token')).toBe('reg.token')
    })
  })

  describe('logout', () => {
    it('efface le token, l\'utilisateur et localStorage', () => {
      localStorage.setItem('lunivert_token', 'token')
      localStorage.setItem('lunivert_user', JSON.stringify({ id: 1 }))
      const store = useAuthStore()

      store.logout()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(localStorage.getItem('lunivert_token')).toBeNull()
      expect(localStorage.getItem('lunivert_user')).toBeNull()
    })
  })

  describe('refreshUser', () => {
    it('ne fait rien quand pas de token', async () => {
      const store = useAuthStore()
      await store.refreshUser()
      expect(authApi.getMe).not.toHaveBeenCalled()
    })

    it('met à jour l\'utilisateur depuis l\'API quand le token existe', async () => {
      localStorage.setItem('lunivert_token', 'un.token')
      const updatedUser = { id: 1, name: 'Nom mis à jour' }
      authApi.getMe.mockResolvedValue({ data: updatedUser })
      const store = useAuthStore()

      await store.refreshUser()

      expect(store.user).toEqual(updatedUser)
      expect(JSON.parse(localStorage.getItem('lunivert_user'))).toEqual(updatedUser)
    })
  })

  describe('setUser', () => {
    it('met à jour l\'utilisateur dans l\'état et localStorage', () => {
      const store = useAuthStore()
      const user = { id: 1, name: 'Charlie', role: 'user' }

      store.setUser(user)

      expect(store.user).toEqual(user)
      expect(JSON.parse(localStorage.getItem('lunivert_user'))).toEqual(user)
    })
  })
})
