import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/index.vue'

const router = createRouter({
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
      component: () => import('@/views/annonces/index.vue'),
    },
    {
      path: '/annonces/:id',
      name: 'listing',
      component: () => import('@/views/annonces/detail.vue'),
    },
    {
      path: '/connexion',
      name: 'login',
      component: () => import('@/views/auth/connexion.vue'),
    },
    {
      path: '/inscription',
      name: 'register',
      component: () => import('@/views/auth/inscription.vue'),
    },
    {
      path: '/deposer',
      name: 'create-listing',
      component: () => import('@/views/annonces/deposer.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mes-annonces',
      name: 'my-listings',
      component: () => import('@/views/annonces/mes-annonces.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favoris',
      name: 'favorites',
      component: () => import('@/views/annonces/favoris.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profil',
      name: 'profile',
      component: () => import('@/views/users/profil.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('@/views/messages/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/comment-ca-marche',
      name: 'how-it-works',
      component: () => import('@/views/comment-ca-marche.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/not-found.vue'),
    },
  ],
})

export default router
