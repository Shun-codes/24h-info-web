import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('jsonwebtoken')

import jwt from 'jsonwebtoken'
import { requireAuth, optionalAuth, requireRole } from './auth.middleware.js'

describe('requireAuth', () => {
  let req, res, next

  beforeEach(() => {
    req = { headers: {} }
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    next = vi.fn()
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test_secret'
  })

  it('retourne 401 quand il n\'y a pas de header Authorization', () => {
    requireAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant ou invalide' })
    expect(next).not.toHaveBeenCalled()
  })

  it('retourne 401 quand le header ne commence pas par Bearer', () => {
    req.headers.authorization = 'Basic abc123'
    requireAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('définit req.user et appelle next() avec un token valide', () => {
    req.headers.authorization = 'Bearer valid.token.here'
    jwt.verify.mockReturnValue({ sub: '42' })
    requireAuth(req, res, next)
    expect(req.user).toEqual({ id: 42 })
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('convertit le sub en number', () => {
    req.headers.authorization = 'Bearer valid.token'
    jwt.verify.mockReturnValue({ sub: '7' })
    requireAuth(req, res, next)
    expect(req.user.id).toBe(7)
    expect(typeof req.user.id).toBe('number')
  })

  it('retourne 401 quand jwt.verify lève une exception', () => {
    req.headers.authorization = 'Bearer bad.token'
    jwt.verify.mockImplementation(() => { throw new Error('jwt malformed') })
    requireAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token expiré ou invalide' })
    expect(next).not.toHaveBeenCalled()
  })
})

describe('optionalAuth', () => {
  let req, res, next

  beforeEach(() => {
    req = { headers: {} }
    res = {}
    next = vi.fn()
    vi.clearAllMocks()
  })

  it('appelle next() sans définir req.user quand pas de header', () => {
    optionalAuth(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.user).toBeUndefined()
  })

  it('définit req.user avec un token Bearer valide', () => {
    req.headers.authorization = 'Bearer valid.token'
    jwt.verify.mockReturnValue({ sub: '5' })
    optionalAuth(req, res, next)
    expect(req.user).toEqual({ id: 5 })
    expect(next).toHaveBeenCalled()
  })

  it('appelle next() sans req.user quand le token est invalide', () => {
    req.headers.authorization = 'Bearer invalid.token'
    jwt.verify.mockImplementation(() => { throw new Error('invalid') })
    optionalAuth(req, res, next)
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  it('ignore un header qui n\'est pas Bearer', () => {
    req.headers.authorization = 'Basic abc'
    optionalAuth(req, res, next)
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })
})

describe('requireRole', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    next = vi.fn()
  })

  it('retourne 401 quand req.user n\'est pas défini', () => {
    requireRole('admin')(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Non authentifié' })
  })

  it('retourne 403 quand le rôle de l\'utilisateur ne correspond pas', () => {
    req.user = { id: 1, role: 'user' }
    requireRole('admin', 'moderator')(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé' })
  })

  it('appelle next() quand le rôle correspond exactement', () => {
    req.user = { id: 1, role: 'admin' }
    requireRole('admin')(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('appelle next() quand le rôle est dans la liste des rôles autorisés', () => {
    req.user = { id: 1, role: 'moderator' }
    requireRole('admin', 'moderator')(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
