import client from './client.js'

export const sendMessage      = (data)   => client.post('/messages', data)
export const getConversations = ()       => client.get('/messages')
export const getThread        = (id)     => client.get(`/messages/thread/${id}`)
export const markRead         = (id)     => client.patch(`/messages/${id}/read`)
