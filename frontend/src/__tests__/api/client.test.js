import { describe, it, expect, beforeAll } from 'vitest'
import client from '@/api/client.js'

// Accès direct aux intercepteurs axios pour les tester en isolation
const requestInterceptor = client.interceptors.request.handlers[0]
const responseInterceptor = client.interceptors.response.handlers[0]

describe('Client API - Intercepteur de requête', () => {
  beforeAll(() => {
    localStorage.clear()
  })

  it('ajoute le header Authorization quand un token est présent', () => {
    localStorage.setItem('lunivert_token', 'mon.jwt.token')
    const config = { headers: {} }

    const result = requestInterceptor.fulfilled(config)

    expect(result.headers.Authorization).toBe('Bearer mon.jwt.token')
  })

  it('n\'ajoute pas le header Authorization quand pas de token', () => {
    localStorage.removeItem('lunivert_token')
    const config = { headers: {} }

    const result = requestInterceptor.fulfilled(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('supprime Content-Type pour les requêtes FormData', () => {
    localStorage.removeItem('lunivert_token')
    const formData = new FormData()
    const config = { headers: { 'Content-Type': 'application/json' }, data: formData }

    const result = requestInterceptor.fulfilled(config)

    expect(result.headers['Content-Type']).toBeUndefined()
  })

  it('conserve Content-Type pour les requêtes JSON ordinaires', () => {
    localStorage.removeItem('lunivert_token')
    const config = { headers: { 'Content-Type': 'application/json' }, data: { key: 'value' } }

    const result = requestInterceptor.fulfilled(config)

    expect(result.headers['Content-Type']).toBe('application/json')
  })

  it('retourne le config modifié', () => {
    const config = { headers: {}, extraProp: 'test' }
    const result = requestInterceptor.fulfilled(config)
    expect(result).toBe(config)
  })
})

describe('Client API - Intercepteur de réponse', () => {
  it('passe les réponses réussies sans modification', () => {
    const response = { status: 200, data: { ok: true } }
    expect(responseInterceptor.fulfilled(response)).toBe(response)
  })

  it('efface le token et l\'utilisateur du localStorage lors d\'une erreur 401', async () => {
    localStorage.setItem('lunivert_token', 'token.valide')
    localStorage.setItem('lunivert_user', JSON.stringify({ id: 1 }))

    const error = { response: { status: 401 } }
    await expect(responseInterceptor.rejected(error)).rejects.toBeDefined()

    expect(localStorage.getItem('lunivert_token')).toBeNull()
    expect(localStorage.getItem('lunivert_user')).toBeNull()
  })

  it('redirige vers /connexion lors d\'une erreur 401', async () => {
    const error = { response: { status: 401 } }
    await expect(responseInterceptor.rejected(error)).rejects.toBeDefined()
    expect(window.location.href).toBe('/connexion')
  })

  it('rejette l\'erreur sans redirection pour les erreurs non-401', async () => {
    window.location.href = ''
    localStorage.setItem('lunivert_token', 'token')
    const error = { response: { status: 500 } }

    await expect(responseInterceptor.rejected(error)).rejects.toEqual(error)
    expect(window.location.href).toBe('')
    expect(localStorage.getItem('lunivert_token')).toBe('token')
  })
})
