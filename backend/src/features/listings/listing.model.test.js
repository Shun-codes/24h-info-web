import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/database.js')

import db from '../../config/database.js'
import { ListingModel } from './listing.model.js'

describe('ListingModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findAll', () => {
    it('requête avec les filtres par défaut (is_hidden = false, expires_at > NOW)', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.findAll({})
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('l.is_hidden = false')
      expect(sql).toContain("l.expires_at > NOW()")
    })

    it('inclut la condition ILIKE quand search est fourni', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.findAll({ search: 'vélo' })
      const [sql, params] = db.query.mock.calls[0]
      expect(sql).toContain('ILIKE')
      expect(params).toContain('%vélo%')
    })

    it('inclut la condition sur le slug de catégorie', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.findAll({ category: 'auto-moto' })
      const [sql, params] = db.query.mock.calls[0]
      expect(sql).toContain('c.slug')
      expect(params).toContain('auto-moto')
    })

    it('inclut la condition sur la ville avec ILIKE', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.findAll({ city: 'Paris' })
      const [sql, params] = db.query.mock.calls[0]
      expect(sql).toContain('l.city ILIKE')
      expect(params).toContain('%Paris%')
    })

    it('inclut les conditions de prix min et max', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.findAll({ min_price: 10, max_price: 500 })
      const [sql, params] = db.query.mock.calls[0]
      expect(sql).toContain('price >=')
      expect(sql).toContain('price <=')
      expect(params).toContain(10)
      expect(params).toContain(500)
    })

    it('retourne les annonces de la requête', async () => {
      const listings = [{ id: 1, title: 'Vélo de course' }, { id: 2, title: 'Moto' }]
      db.query.mockResolvedValue({ rows: listings })
      const result = await ListingModel.findAll({})
      expect(result).toEqual(listings)
    })

    it('combine plusieurs filtres correctement', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.findAll({ search: 'vélo', category: 'sport', min_price: 50 })
      const params = db.query.mock.calls[0][1]
      expect(params).toContain('%vélo%')
      expect(params).toContain('sport')
      expect(params).toContain(50)
    })
  })

  describe('findById', () => {
    it('retourne l\'annonce avec les images et infos vendeur', async () => {
      const listing = { id: 1, title: 'Vélo', images: ['img1.jpg'], is_favorited: false }
      db.query.mockResolvedValue({ rows: [listing] })
      const result = await ListingModel.findById(1)
      expect(result).toEqual(listing)
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1, null])
    })

    it('passe userId pour la vérification des favoris', async () => {
      db.query.mockResolvedValue({ rows: [{}] })
      await ListingModel.findById(1, 5)
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1, 5])
    })

    it('retourne null quand l\'annonce n\'est pas trouvée', async () => {
      db.query.mockResolvedValue({ rows: [] })
      const result = await ListingModel.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('insère l\'annonce avec une expiration de 90 jours et retourne la ligne créée', async () => {
      const data = {
        user_id: 1, category_id: 2, title: 'Vélo', description: 'Bon état',
        price: 150, city: 'Paris', contact_method: 'email',
      }
      const created = { id: 10, ...data }
      db.query.mockResolvedValue({ rows: [created] })
      const result = await ListingModel.create(data)
      expect(result).toEqual(created)
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain("NOW() + INTERVAL '90 days'")
    })
  })

  describe('update', () => {
    it('retourne null quand aucun champ autorisé n\'est fourni', async () => {
      const result = await ListingModel.update(1, 1, { champInconnu: 'valeur' })
      expect(result).toBeNull()
      expect(db.query).not.toHaveBeenCalled()
    })

    it('met à jour les champs fournis et retourne l\'annonce modifiée', async () => {
      const updated = { id: 1, title: 'Nouveau titre', price: 200 }
      db.query.mockResolvedValue({ rows: [updated] })
      const result = await ListingModel.update(1, 1, { title: 'Nouveau titre', price: 200 })
      expect(result).toEqual(updated)
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('title = ')
      expect(sql).toContain('price = ')
    })

    it('vérifie la propriété via user_id dans la clause WHERE', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.update(1, 99, { title: 'Titre' })
      const sql = db.query.mock.calls[0][0]
      expect(sql).toContain('user_id')
    })

    it('retourne null quand l\'annonce n\'appartient pas à l\'utilisateur', async () => {
      db.query.mockResolvedValue({ rows: [] })
      const result = await ListingModel.update(1, 99, { title: 'Titre' })
      expect(result).toBeNull()
    })

    it('permet de masquer une annonce avec is_hidden', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1, is_hidden: true }] })
      await ListingModel.update(1, 1, { is_hidden: true })
      const [sql, params] = db.query.mock.calls[0]
      expect(sql).toContain('is_hidden = ')
      expect(params).toContain(true)
    })
  })

  describe('delete', () => {
    it('retourne true quand l\'annonce est supprimée avec succès', async () => {
      db.query.mockResolvedValue({ rowCount: 1 })
      const result = await ListingModel.delete(1, 1)
      expect(result).toBe(true)
    })

    it('retourne false quand l\'annonce n\'existe pas ou n\'appartient pas à l\'utilisateur', async () => {
      db.query.mockResolvedValue({ rowCount: 0 })
      const result = await ListingModel.delete(1, 99)
      expect(result).toBe(false)
    })
  })

  describe('findByUser', () => {
    it('retourne les annonces de l\'utilisateur triées par date', async () => {
      const userListings = [{ id: 2, title: 'Moto' }, { id: 1, title: 'Vélo' }]
      db.query.mockResolvedValue({ rows: userListings })
      const result = await ListingModel.findByUser(3)
      expect(result).toEqual(userListings)
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE l.user_id = $1'), [3])
    })
  })

  describe('toggleFavorite', () => {
    it('ajoute aux favoris quand pas encore en favori', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
      const result = await ListingModel.toggleFavorite(1, 5)
      expect(result).toEqual({ favorited: true })
      expect(db.query).toHaveBeenCalledTimes(2)
    })

    it('supprime des favoris quand déjà en favori', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ 1: 1 }] })
        .mockResolvedValueOnce({ rows: [] })
      const result = await ListingModel.toggleFavorite(1, 5)
      expect(result).toEqual({ favorited: false })
    })
  })

  describe('getFavorites', () => {
    it('retourne les favoris de l\'utilisateur', async () => {
      const favorites = [{ id: 1, title: 'Vélo' }]
      db.query.mockResolvedValue({ rows: favorites })
      const result = await ListingModel.getFavorites(1)
      expect(result).toEqual(favorites)
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1])
    })
  })

  describe('addImages', () => {
    it('insère les images avec leur position', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.addImages(1, ['img1.jpg', 'img2.jpg'])
      const [sql, params] = db.query.mock.calls[0]
      expect(sql).toContain('INSERT INTO listing_images')
      expect(params).toContain(1)
      expect(params).toContain('img1.jpg')
      expect(params).toContain('img2.jpg')
    })
  })

  describe('report', () => {
    it('insère un signalement en base de données', async () => {
      db.query.mockResolvedValue({ rows: [] })
      await ListingModel.report(5, 2, { reason: 'spam', description: 'Contenu inapproprié' })
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO reports'),
        [5, 2, 'spam', 'Contenu inapproprié'],
      )
    })
  })
})
