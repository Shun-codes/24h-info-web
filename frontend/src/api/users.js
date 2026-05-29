import client from './client.js'

export const getUser       = (id)   => client.get(`/users/${id}`)
export const updateProfile = (data) => client.put('/users/me', data)
export const deleteAccount = ()     => client.delete('/users/me')
