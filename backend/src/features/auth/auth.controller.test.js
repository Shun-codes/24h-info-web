import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('bcryptjs')
vi.mock('jsonwebtoken')
vi.mock('../users/user.model.js')

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../users/user.model.js'
import { register, login, getMe, updatePassword } from './auth.controller.js'

describe('register', () => {
  let req, res, next

  beforeEach(() => {
    req = { body: {} }
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    next = vi.fn()
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test_secret'
  })

  it('retourne 400 quand l\'email est manquant', async () => {
    req.body = { password: 'password123', name: 'Alice' }
    await register(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Email, mot de passe et nom requis' })
  })

  it('retourne 400 quand le mot de passe est manquant', async () => {
    req.body = { email: 'a@b.com', name: 'Alice' }
    await register(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('retourne 400 quand le nom est manquant', async () => {
    req.body = { email: 'a@b.com', password: 'password123' }
    await register(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('retourne 400 quand le mot de passe fait moins de 8 caractères', async () => {
    req.body = { email: 'a@b.com', password: 'court', name: 'Alice' }
    await register(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Le mot de passe doit contenir au moins 8 caractères' })
  })

  it('retourne 409 quand l\'email existe déjà', async () => {
    req.body = { email: 'existant@test.com', password: 'password123', name: 'Alice' }
    UserModel.findByEmail.mockResolvedValue({ id: 1, email: 'existant@test.com' })
    await register(req, res, next)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'Cet email est déjà utilisé' })
  })

  it('crée l\'utilisateur et retourne 201 avec token', async () => {
    req.body = { email: 'nouveau@test.com', password: 'password123', name: 'Bob' }
    UserModel.findByEmail.mockResolvedValue(null)
    bcrypt.hash.mockResolvedValue('hashed_password')
    const newUser = { id: 5, email: 'nouveau@test.com', name: 'Bob' }
    UserModel.create.mockResolvedValue(newUser)
    jwt.sign.mockReturnValue('jwt.token.here')

    await register(req, res, next)

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12)
    expect(UserModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'nouveau@test.com', password: 'hashed_password', name: 'Bob' }),
    )
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ token: 'jwt.token.here', user: newUser })
  })

  it('transmet l\'erreur à next() en cas d\'exception', async () => {
    req.body = { email: 'a@b.com', password: 'password123', name: 'Alice' }
    const err = new Error('DB inaccessible')
    UserModel.findByEmail.mockRejectedValue(err)
    await register(req, res, next)
    expect(next).toHaveBeenCalledWith(err)
  })
})

describe('login', () => {
  let req, res, next

  beforeEach(() => {
    req = { body: {} }
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    next = vi.fn()
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test_secret'
  })

  it('retourne 400 quand l\'email est manquant', async () => {
    req.body = { password: 'pass' }
    await login(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Email et mot de passe requis' })
  })

  it('retourne 400 quand le mot de passe est manquant', async () => {
    req.body = { email: 'a@b.com' }
    await login(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('retourne 401 quand l\'utilisateur n\'existe pas', async () => {
    req.body = { email: 'fantome@test.com', password: 'password123' }
    UserModel.findByEmail.mockResolvedValue(null)
    await login(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Identifiants incorrects' })
  })

  it('retourne 401 quand le mot de passe ne correspond pas', async () => {
    req.body = { email: 'a@b.com', password: 'mauvaispass' }
    UserModel.findByEmail.mockResolvedValue({ id: 1, email: 'a@b.com', password: 'hashed', is_banned: false })
    bcrypt.compare.mockResolvedValue(false)
    await login(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('retourne 403 quand l\'utilisateur est banni', async () => {
    req.body = { email: 'banni@test.com', password: 'password123' }
    UserModel.findByEmail.mockResolvedValue({ id: 2, email: 'banni@test.com', password: 'hashed', is_banned: true })
    bcrypt.compare.mockResolvedValue(true)
    await login(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ message: 'Compte suspendu, contactez le support' })
  })

  it('retourne le token et l\'utilisateur sans le mot de passe en cas de succès', async () => {
    req.body = { email: 'a@b.com', password: 'password123' }
    const dbUser = { id: 3, email: 'a@b.com', name: 'Alice', password: 'hashed', is_banned: false }
    UserModel.findByEmail.mockResolvedValue(dbUser)
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('jwt.token')

    await login(req, res, next)

    const { password: _, ...safeUser } = dbUser
    expect(res.json).toHaveBeenCalledWith({ token: 'jwt.token', user: safeUser })
    const response = res.json.mock.calls[0][0]
    expect(response.user.password).toBeUndefined()
  })

  it('transmet l\'erreur à next() en cas d\'exception', async () => {
    req.body = { email: 'a@b.com', password: 'pass' }
    const err = new Error('DB inaccessible')
    UserModel.findByEmail.mockRejectedValue(err)
    await login(req, res, next)
    expect(next).toHaveBeenCalledWith(err)
  })
})

describe('getMe', () => {
  let req, res, next

  beforeEach(() => {
    req = { user: { id: 1 } }
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    next = vi.fn()
    vi.clearAllMocks()
  })

  it('retourne 404 quand l\'utilisateur n\'est pas trouvé', async () => {
    UserModel.findById.mockResolvedValue(null)
    await getMe(req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur introuvable' })
  })

  it('retourne les données de l\'utilisateur en cas de succès', async () => {
    const user = { id: 1, email: 'a@b.com', name: 'Alice' }
    UserModel.findById.mockResolvedValue(user)
    await getMe(req, res, next)
    expect(res.json).toHaveBeenCalledWith(user)
  })

  it('transmet l\'erreur à next() en cas d\'exception', async () => {
    const err = new Error('DB error')
    UserModel.findById.mockRejectedValue(err)
    await getMe(req, res, next)
    expect(next).toHaveBeenCalledWith(err)
  })
})

describe('updatePassword', () => {
  let req, res, next

  beforeEach(() => {
    req = { user: { id: 1 }, body: {} }
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    next = vi.fn()
    vi.clearAllMocks()
  })

  it('retourne 400 quand currentPassword est manquant', async () => {
    req.body = { newPassword: 'newpass123' }
    await updatePassword(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Champs requis manquants' })
  })

  it('retourne 400 quand newPassword est manquant', async () => {
    req.body = { currentPassword: 'oldpass123' }
    await updatePassword(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('retourne 400 quand le nouveau mot de passe fait moins de 8 caractères', async () => {
    req.body = { currentPassword: 'oldpass123', newPassword: 'court' }
    await updatePassword(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
  })

  it('retourne 401 quand le mot de passe actuel ne correspond pas', async () => {
    req.body = { currentPassword: 'mauvais', newPassword: 'newpass123' }
    UserModel.findById.mockResolvedValue({ id: 1, password: 'hashed_old' })
    bcrypt.compare.mockResolvedValue(false)
    await updatePassword(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe actuel incorrect' })
  })

  it('met à jour le mot de passe et retourne 200 en cas de succès', async () => {
    req.body = { currentPassword: 'oldpass123', newPassword: 'newpass123' }
    UserModel.findById.mockResolvedValue({ id: 1, password: 'hashed_old' })
    bcrypt.compare.mockResolvedValue(true)
    bcrypt.hash.mockResolvedValue('hashed_new')
    UserModel.updatePassword.mockResolvedValue(undefined)

    await updatePassword(req, res, next)

    expect(bcrypt.hash).toHaveBeenCalledWith('newpass123', 12)
    expect(UserModel.updatePassword).toHaveBeenCalledWith(1, 'hashed_new')
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe mis à jour' })
  })
})
