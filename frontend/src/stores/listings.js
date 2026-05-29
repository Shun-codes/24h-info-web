import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as listingsApi from '@/api/listings.js'

export const useListingsStore = defineStore('listings', () => {
  const listings  = ref([])
  const listing   = ref(null)
  const favorites = ref([])
  const loading   = ref(false)
  const error     = ref(null)

  async function fetchListings(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await listingsApi.getListings(params)
      listings.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  async function fetchListing(id) {
    loading.value = true
    error.value = null
    try {
      const { data } = await listingsApi.getListing(id)
      listing.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Annonce introuvable'
    } finally {
      loading.value = false
    }
  }

  async function fetchFavorites() {
    const { data } = await listingsApi.getFavorites()
    favorites.value = data
  }

  async function toggleFavorite(id) {
    const { data } = await listingsApi.toggleFavorite(id)
    if (data.favorited) {
      if (listing.value?.id === id) listing.value.isFavorited = true
    } else {
      favorites.value = favorites.value.filter((l) => l.id !== id)
      if (listing.value?.id === id) listing.value.isFavorited = false
    }
    return data.favorited
  }

  return { listings, listing, favorites, loading, error, fetchListings, fetchListing, fetchFavorites, toggleFavorite }
})
