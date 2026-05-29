import client from './client.js'

export const login    = (credentials) => client.post('/auth/login', credentials)
export const register = (data)        => client.post('/auth/register', data)
export const getMe    = ()            => client.get('/auth/me')
