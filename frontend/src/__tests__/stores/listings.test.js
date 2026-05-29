import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/api/listings.js')

import * as listingsApi from '@/api/listings.js'
import { useListingsStore } from '@/stores/listings.js'

describe('useListingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('état initial', () => {
    it('commence avec des listes vides et sans erreur', () => {
      const store = useListingsStore()
      expect(store.listings).toEqual([])
      expect(store.listing).toBeNull()
      expect(store.favorites).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchListings', () => {
    it('définit les annonces en cas de succès', async () => {
      const data = [{ id: 1, title: 'Vélo de course' }, { id: 2, title: 'Moto' }]
      listingsApi.getListings.mockResolvedValue({ data })
      const store = useListingsStore()

      await store.fetchListings()

      expect(store.listings).toEqual(data)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('passe les paramètres de filtre à l\'API', async () => {
      listingsApi.getListings.mockResolvedValue({ data: [] })
      const store = useListingsStore()
      const params = { search: 'vélo', category: 'sport', min_price: 50 }

      await store.fetchListings(params)

      expect(listingsApi.getListings).toHaveBeenCalledWith(params)
    })

    it('définit l\'erreur en cas d\'échec avec message API', async () => {
      listingsApi.getListings.mockRejectedValue({ response: { data: { message: 'Erreur serveur' } } })
      const store = useListingsStore()

      await store.fetchListings()

      expect(store.error).toBe('Erreur serveur')
      expect(store.loading).toBe(false)
      expect(store.listings).toEqual([])
    })

    it('utilise le message générique quand la réponse n\'a pas de message', async () => {
      listingsApi.getListings.mockRejectedValue(new Error('Network Error'))
      const store = useListingsStore()

      await store.fetchListings()

      expect(store.error).toBe('Erreur lors du chargement')
    })

    it('remet loading à false même après une erreur', async () => {
      listingsApi.getListings.mockRejectedValue(new Error('fail'))
      const store = useListingsStore()

      await store.fetchListings()

      expect(store.loading).toBe(false)
    })

    it('réinitialise l\'erreur au début de chaque requête', async () => {
      listingsApi.getListings.mockResolvedValue({ data: [] })
      const store = useListingsStore()
      store.error = 'ancienne erreur'

      await store.fetchListings()

      expect(store.error).toBeNull()
    })
  })

  describe('fetchListing', () => {
    it('définit l\'annonce en cas de succès', async () => {
      const listing = { id: 1, title: 'Vélo', images: ['img.jpg'] }
      listingsApi.getListing.mockResolvedValue({ data: listing })
      const store = useListingsStore()

      await store.fetchListing(1)

      expect(store.listing).toEqual(listing)
      expect(store.loading).toBe(false)
    })

    it('définit l\'erreur en cas d\'échec avec message API', async () => {
      listingsApi.getListing.mockRejectedValue({ response: { data: { message: 'Annonce introuvable' } } })
      const store = useListingsStore()

      await store.fetchListing(999)

      expect(store.error).toBe('Annonce introuvable')
    })

    it('utilise le message générique quand la réponse n\'a pas de message', async () => {
      listingsApi.getListing.mockRejectedValue(new Error('fail'))
      const store = useListingsStore()

      await store.fetchListing(999)

      expect(store.error).toBe('Annonce introuvable')
    })
  })

  describe('fetchFavorites', () => {
    it('définit les favoris depuis l\'API', async () => {
      const favs = [{ id: 2, title: 'Moto' }, { id: 3, title: 'Vélo' }]
      listingsApi.getFavorites.mockResolvedValue({ data: favs })
      const store = useListingsStore()

      await store.fetchFavorites()

      expect(store.favorites).toEqual(favs)
    })
  })

  describe('toggleFavorite', () => {
    it('met isFavorited à true sur l\'annonce courante lors de l\'ajout', async () => {
      listingsApi.toggleFavorite.mockResolvedValue({ data: { favorited: true } })
      const store = useListingsStore()
      store.listing = { id: 3, title: 'Vélo', isFavorited: false }

      const result = await store.toggleFavorite(3)

      expect(store.listing.isFavorited).toBe(true)
      expect(result).toBe(true)
    })

    it('retire l\'annonce des favoris et met isFavorited à false lors de la suppression', async () => {
      listingsApi.toggleFavorite.mockResolvedValue({ data: { favorited: false } })
      const store = useListingsStore()
      store.listing = { id: 3, title: 'Vélo', isFavorited: true }
      store.favorites = [{ id: 3, title: 'Vélo' }, { id: 4, title: 'Moto' }]

      const result = await store.toggleFavorite(3)

      expect(store.listing.isFavorited).toBe(false)
      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].id).toBe(4)
      expect(result).toBe(false)
    })

    it('ne modifie pas l\'annonce courante quand ce n\'est pas celle qui est mise en favori', async () => {
      listingsApi.toggleFavorite.mockResolvedValue({ data: { favorited: true } })
      const store = useListingsStore()
      store.listing = { id: 5, title: 'Autre annonce', isFavorited: false }

      await store.toggleFavorite(3)

      expect(store.listing.isFavorited).toBe(false)
    })

    it('ne modifie pas listing quand il est null', async () => {
      listingsApi.toggleFavorite.mockResolvedValue({ data: { favorited: true } })
      const store = useListingsStore()
      store.listing = null

      await expect(store.toggleFavorite(3)).resolves.toBe(true)
    })
  })
})
