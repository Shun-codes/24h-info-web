import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth.js'

/**
 * Store Pinia pour l'authentification.
 *
 * L'état est persisté dans localStorage au format :
 *   lunivert_token → JWT brut
 *   lunivert_user  → JSON de l'objet utilisateur (sans mot de passe)
 *
 * L'initialisation lit localStorage pour restaurer la session après un
 * rechargement de page, sans requête réseau.
 */
export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('lunivert_user') || 'null'))
  const token = ref(localStorage.getItem('lunivert_token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin       = computed(() => user.value?.role === 'admin')
  // Les admins ont aussi les droits modérateur
  const isModerator   = computed(() => ['admin', 'moderator'].includes(user.value?.role))

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    _persist(data)
  }

  async function register(userData) {
    const { data } = await authApi.register(userData)
    _persist(data)
  }

  /**
   * Resynchronise le profil depuis l'API (après modification du profil).
   * Sans effet si l'utilisateur n'est pas connecté.
   */
  async function refreshUser() {
    if (!token.value) return
    const { data } = await authApi.getMe()
    user.value = data
    localStorage.setItem('lunivert_user', JSON.stringify(data))
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('lunivert_token')
    localStorage.removeItem('lunivert_user')
  }

  /** Met à jour l'objet user dans le store et localStorage sans refaire de requête. */
  function setUser(nextUser) {
    user.value = nextUser
    localStorage.setItem('lunivert_user', JSON.stringify(nextUser))
  }

  /** Sauvegarde token + user après login ou register. */
  function _persist({ token: t, user: u }) {
    token.value = t
    user.value  = u
    localStorage.setItem('lunivert_token', t)
    localStorage.setItem('lunivert_user', JSON.stringify(u))
  }

  return { user, token, isAuthenticated, isAdmin, isModerator, login, register, refreshUser, setUser, logout }
})
