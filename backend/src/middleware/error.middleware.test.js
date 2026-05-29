import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { notFound, errorHandler } from './error.middleware.js'

describe('notFound', () => {
  it('retourne 404 avec la méthode et le chemin', () => {
    const req = { method: 'GET', path: '/unknown' }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    notFound(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Route GET /unknown introuvable' })
  })

  it('retourne 404 pour une méthode POST', () => {
    const req = { method: 'POST', path: '/api/inexistant' }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    notFound(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Route POST /api/inexistant introuvable' })
  })
})

describe('errorHandler', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    next = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retourne 409 pour une violation de contrainte unique PostgreSQL (23505)', () => {
    const err = { code: '23505', message: 'duplicate', stack: '' }
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'Cette ressource existe déjà' })
  })

  it('retourne 400 pour une violation de clé étrangère PostgreSQL (23503)', () => {
    const err = { code: '23503', message: 'fk error', stack: '' }
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Référence invalide' })
  })

  it('retourne 400 pour un format de données invalide PostgreSQL (22P02)', () => {
    const err = { code: '22P02', message: 'invalid input', stack: '' }
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Format de données invalide' })
  })

  it('retourne 400 pour une erreur de taille de fichier Multer', () => {
    const err = { code: 'LIMIT_FILE_SIZE', message: 'too large', stack: '' }
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Fichier trop volumineux (max 5 Mo)' })
  })

  it('utilise err.status quand il est défini', () => {
    const err = { status: 422, message: 'Non traitable', stack: '' }
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith({ message: 'Non traitable' })
  })

  it('utilise err.statusCode quand err.status est absent', () => {
    const err = { statusCode: 503, message: 'Service indisponible', stack: '' }
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(503)
  })

  it('utilise 500 par défaut quand aucun statut n\'est défini', () => {
    const err = { message: 'Erreur inattendue', stack: '' }
    errorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Erreur inattendue' }))
  })

  it('inclut la stack trace en mode développement', () => {
    process.env.NODE_ENV = 'development'
    const err = { message: 'dev error', stack: 'Error: dev error\n  at Test' }
    errorHandler(err, req, res, next)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ stack: err.stack }))
  })

  it('n\'inclut pas la stack trace en dehors du mode développement', () => {
    process.env.NODE_ENV = 'production'
    const err = { message: 'prod error', stack: 'Error: ...' }
    errorHandler(err, req, res, next)
    const callArg = res.json.mock.calls[0][0]
    expect(callArg.stack).toBeUndefined()
  })
})
