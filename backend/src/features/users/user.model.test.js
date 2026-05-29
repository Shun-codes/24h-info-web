import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/database.js')

import db from '../../config/database.js'
import { UserModel } from './user.model.js'

describe('UserModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findById', () => {
    it('retourne l\'utilisateur quand il est trouvé', async () => {
      const user = { id: 1, email: 'a@b.com', name: 'Alice', role: 'user' }
      db.query.mockResolvedValue({ rows: [user] })
      const result = await UserModel.findById(1)
      expect(result).toEqual(user)
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), [1])
    })

    it('retourne null quand l\'utilisateur n\'est pas trouvé', async () => {
      db.query.mockResolvedValue({ rows: [] })
      const result = await UserModel.findById(999)
      expect(result).toBeNull()
    })

    it('exclut le mot de passe dans la sélection', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await UserModel.findById(1)
      const sql = db.query.mock.calls[0][0]
      expect(sql).not.toContain('password')
    })
  })

  describe('findByEmail', () => {
    it('retourne l\'utilisateur complet incluant le mot de passe', async () => {
      const user = { id: 1, email: 'a@b.com', password: 'hashed' }
      db.query.mockResolvedValue({ rows: [user] })
      const result = await UserModel.findByEmail('a@b.com')
      expect(result).toEqual(user)
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE email = $1'), ['a@b.com'])
    })

    it('retourne null quand l\'email n\'est pas trouvé', async () => {
      db.query.mockResolvedValue({ rows: [] })
      const result = await UserModel.findByEmail('fantome@test.com')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('insère l\'utilisateur et retourne la ligne créée', async () => {
      const userData = { email: 'new@test.com', password: 'hashed', name: 'Bob', phone: null, city: null }
      const created = { id: 5, ...userData, role: 'user', created_at: new Date() }
      db.query.mockResolvedValue({ rows: [created] })
      const result = await UserModel.create(userData)
      expect(result).toEqual(created)
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [userData.email, userData.password, userData.name, userData.phone, userData.city],
      )
    })
  })

  describe('update', () => {
    it('retourne l\'utilisateur mis à jour', async () => {
      const updated = { id: 1, email: 'nouveau@b.com', name: 'Alice' }
      db.query.mockResolvedValue({ rows: [updated] })
      const result = await UserModel.update(1, { email: 'nouveau@b.com' })
      expect(result).toEqual(updated)
    })

    it('retourne null quand l\'utilisateur n\'est pas trouvé', async () => {
      db.query.mockResolvedValue({ rows: [] })
      const result = await UserModel.update(999, { name: 'Fantôme' })
      expect(result).toBeNull()
    })

    it('utilise COALESCE pour les mises à jour partielles', async () => {
      db.query.mockResolvedValue({ rows: [{}] })
      await UserModel.update(1, { name: 'Nouveau nom' })
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('COALESCE')
    })
  })

  describe('updatePassword', () => {
    it('exécute la requête de mise à jour du mot de passe', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await UserModel.updatePassword(1, 'nouveau_hash')
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET password'),
        ['nouveau_hash', 1],
      )
    })
  })

  describe('delete', () => {
    it('exécute la requête de suppression', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await UserModel.delete(1)
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users WHERE id = $1'),
        [1],
      )
    })
  })
})
