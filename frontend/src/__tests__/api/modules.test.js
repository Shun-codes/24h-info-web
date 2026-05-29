import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/api/client.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import client from '@/api/client.js'
import { login, register, getMe } from '@/api/auth.js'
import { getListings, getListing, createListing, updateListing, deleteListing, toggleFavorite, getFavorites, getMyListings, reportListing } from '@/api/listings.js'
import { getCategories } from '@/api/categories.js'
import { sendMessage, getConversations, getThread, markRead, getUnreadCount } from '@/api/messages.js'
import { getUser, updateProfile, deleteAccount } from '@/api/users.js'

beforeEach(() => {
  vi.clearAllMocks()
  client.get.mockResolvedValue({ data: {} })
  client.post.mockResolvedValue({ data: {} })
  client.put.mockResolvedValue({ data: {} })
  client.patch.mockResolvedValue({ data: {} })
  client.delete.mockResolvedValue({ data: {} })
})

describe('api/auth.js', () => {
  it('login() appelle POST /auth/login avec les identifiants', () => {
    const credentials = { email: 'a@b.com', password: 'pass' }
    login(credentials)
    expect(client.post).toHaveBeenCalledWith('/auth/login', credentials)
  })

  it('register() appelle POST /auth/register avec les données', () => {
    const data = { email: 'b@b.com', password: 'pass', name: 'Bob' }
    register(data)
    expect(client.post).toHaveBeenCalledWith('/auth/register', data)
  })

  it('getMe() appelle GET /auth/me', () => {
    getMe()
    expect(client.get).toHaveBeenCalledWith('/auth/me')
  })
})

describe('api/listings.js', () => {
  it('getListings() appelle GET /listings avec les paramètres', () => {
    const params = { search: 'vélo', category: 'sport' }
    getListings(params)
    expect(client.get).toHaveBeenCalledWith('/listings', { params })
  })

  it('getListing() appelle GET /listings/:id', () => {
    getListing(42)
    expect(client.get).toHaveBeenCalledWith('/listings/42')
  })

  it('createListing() appelle POST /listings', () => {
    const data = { title: 'Vélo', price: 150 }
    createListing(data)
    expect(client.post).toHaveBeenCalledWith('/listings', data)
  })

  it('updateListing() appelle PUT /listings/:id', () => {
    const data = { title: 'Nouveau titre' }
    updateListing(5, data)
    expect(client.put).toHaveBeenCalledWith('/listings/5', data)
  })

  it('deleteListing() appelle DELETE /listings/:id', () => {
    deleteListing(7)
    expect(client.delete).toHaveBeenCalledWith('/listings/7')
  })

  it('toggleFavorite() appelle POST /listings/:id/favorite', () => {
    toggleFavorite(3)
    expect(client.post).toHaveBeenCalledWith('/listings/3/favorite')
  })

  it('getFavorites() appelle GET /listings/favorites', () => {
    getFavorites()
    expect(client.get).toHaveBeenCalledWith('/listings/favorites')
  })

  it('getMyListings() appelle GET /listings/mine', () => {
    getMyListings()
    expect(client.get).toHaveBeenCalledWith('/listings/mine')
  })

  it('reportListing() appelle POST /listings/:id/report', () => {
    const data = { reason: 'spam', description: 'Annonce frauduleuse' }
    reportListing(9, data)
    expect(client.post).toHaveBeenCalledWith('/listings/9/report', data)
  })
})

describe('api/categories.js', () => {
  it('getCategories() appelle GET /categories', () => {
    getCategories()
    expect(client.get).toHaveBeenCalledWith('/categories')
  })
})

describe('api/messages.js', () => {
  it('sendMessage() appelle POST /messages', () => {
    const data = { listing_id: 1, receiver_id: 2, content: 'Bonjour' }
    sendMessage(data)
    expect(client.post).toHaveBeenCalledWith('/messages', data)
  })

  it('getConversations() appelle GET /messages', () => {
    getConversations()
    expect(client.get).toHaveBeenCalledWith('/messages')
  })

  it('getThread() appelle GET /messages/thread/:id', () => {
    getThread(5)
    expect(client.get).toHaveBeenCalledWith('/messages/thread/5')
  })

  it('markRead() appelle PATCH /messages/:id/read', () => {
    markRead(10)
    expect(client.patch).toHaveBeenCalledWith('/messages/10/read')
  })

  it('getUnreadCount() appelle GET /messages/unread-count', () => {
    getUnreadCount()
    expect(client.get).toHaveBeenCalledWith('/messages/unread-count')
  })
})

describe('api/users.js', () => {
  it('getUser() appelle GET /users/:id', () => {
    getUser(3)
    expect(client.get).toHaveBeenCalledWith('/users/3')
  })

  it('updateProfile() appelle PUT /users/me', () => {
    const data = { name: 'Alice', city: 'Paris' }
    updateProfile(data)
    expect(client.put).toHaveBeenCalledWith('/users/me', data)
  })

  it('deleteAccount() appelle DELETE /users/me', () => {
    deleteAccount()
    expect(client.delete).toHaveBeenCalledWith('/users/me')
  })
})
