import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/annonces',
      name: 'listings',
      component: () => import('@/views/ListingsView.vue'),
    },
    {
      path: '/annonces/:id',
      name: 'listing',
      component: () => import('@/views/ListingView.vue'),
    },
    {
      path: '/connexion',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/inscription',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
    },
    {
      path: '/deposer',
      name: 'create-listing',
      component: () => import('@/views/CreateListingView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mes-annonces',
      name: 'my-listings',
      component: () => import('@/views/MyListingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favoris',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profil',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})
