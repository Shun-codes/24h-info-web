import client from './client.js'

export const getListings    = (params)     => client.get('/listings', { params })
export const getListing     = (id)         => client.get(`/listings/${id}`)
export const createListing  = (data)       => client.post('/listings', data)
export const updateListing  = (id, data)   => client.put(`/listings/${id}`, data)
export const deleteListing  = (id)         => client.delete(`/listings/${id}`)
export const toggleFavorite = (id)         => client.post(`/listings/${id}/favorite`)
export const getFavorites   = ()           => client.get('/listings/favorites')
export const getMyListings  = ()           => client.get('/listings/mine')
