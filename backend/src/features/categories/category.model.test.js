import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/database.js')

import db from '../../config/database.js'
import { CategoryModel } from './category.model.js'

describe('CategoryModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findAll', () => {
    it('retourne toutes les catégories avec leur comptage d\'annonces', async () => {
      const categories = [
        { id: 1, name: 'Électronique', slug: 'electronique', listing_count: 5 },
        { id: 2, name: 'Véhicules', slug: 'vehicules', listing_count: 12 },
        { id: 3, name: 'Autres', slug: 'autres', listing_count: 2 },
      ]
      db.query.mockResolvedValue({ rows: categories })
      const result = await CategoryModel.findAll()
      expect(result).toEqual(categories)
    })

    it('appelle la requête sans paramètres', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await CategoryModel.findAll()
      expect(db.query).toHaveBeenCalledOnce()
      expect(db.query.mock.calls[0][1]).toBeUndefined()
    })

    it('compte seulement les annonces visibles et non expirées', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await CategoryModel.findAll()
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('is_hidden = false')
      expect(sql).toContain('expires_at > NOW()')
    })

    it('trie la catégorie "autres" en dernier', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await CategoryModel.findAll()
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain("slug = 'autres'")
    })

    it('retourne un tableau vide quand il n\'y a pas de catégories', async () => {
      db.query.mockResolvedValue({ rows: [] })
      const result = await CategoryModel.findAll()
      expect(result).toEqual([])
    })
  })
})
