import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth.js'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('lunivert_user') || 'null'))
  const token = ref(localStorage.getItem('lunivert_token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin       = computed(() => user.value?.role === 'admin')
  const isModerator   = computed(() => ['admin', 'moderator'].includes(user.value?.role))

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    _persist(data)
  }

  async function register(userData) {
    const { data } = await authApi.register(userData)
    _persist(data)
  }

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

  function _persist({ token: t, user: u }) {
    token.value = t
    user.value  = u
    localStorage.setItem('lunivert_token', t)
    localStorage.setItem('lunivert_user', JSON.stringify(u))
  }

  return { user, token, isAuthenticated, isAdmin, isModerator, login, register, refreshUser, logout }
})
