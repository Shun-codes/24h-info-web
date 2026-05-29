import axios from 'axios'

/**
 * Instance Axios centrale pour toutes les requêtes vers l'API.
 * En développement, Vite proxy `/api` → `http://localhost:3000/api`
 * (voir vite.config.js), donc VITE_API_URL n'est pas nécessaire en local.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Injecte le token JWT dans chaque requête si l'utilisateur est connecté.
// Pour FormData (upload de fichiers), on supprime Content-Type afin que le
// navigateur puisse définir lui-même le boundary multipart/form-data.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('lunivert_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Déconnexion automatique sur 401 : le token a expiré ou a été révoqué.
// La redirection est faite via window.location pour réinitialiser l'état
// de l'app sans passer par Vue Router (qui pourrait boucler).
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lunivert_token')
      localStorage.removeItem('lunivert_user')
      window.location.href = '/connexion'
    }
    return Promise.reject(err)
  },
)

export default client
