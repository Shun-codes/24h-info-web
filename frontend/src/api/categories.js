import client from './client.js'

export const getCategories = () => client.get('/categories')
