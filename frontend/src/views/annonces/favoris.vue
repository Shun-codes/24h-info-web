<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import * as listingsApi from '@/api/listings.js'
import { getCategories } from '@/api/categories.js'

const router = useRouter()
const auth   = useAuthStore()

const favorites  = ref([])
const categories = ref([])
const loading    = ref(true)
const error      = ref('')
const removingId = ref(null)

const categoryGradients = {
  'plantes-interieur': 'linear-gradient(145deg, #1b4332, #40916c)',
  'plantes-fleuries':  'linear-gradient(145deg, #831843, #db2777)',
  'graines-bulbes':    'linear-gradient(145deg, #7c2d12, #dc2626)',
  'arbres-arbustes':   'linear-gradient(145deg, #14532d, #16a34a)',
  'outils-materiel':   'linear-gradient(145deg, #1e3a5f, #2563eb)',
  'services-conseils': 'linear-gradient(145deg, #2d6a4f, #52b788)',
  'cours-ateliers':    'linear-gradient(145deg, #4c1d95, #7c3aed)',
  'mobilier-jardin':   'linear-gradient(145deg, #78350f, #d97706)',
}

function cardBg(listing) {
  if (listing.thumbnail) return null
  return categoryGradients[listing.category_slug] || 'linear-gradient(145deg, #2d6a4f, #52b788)'
}

function formatPrice(price) {
  if (price == null) return 'Gratuit'
  return Number(price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(d) {
  const diff = Math.floor((new Date() - new Date(d)) / 86400000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  if (diff < 7)   return `Il y a ${diff}j`
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

async function removeFavorite(listing) {
  removingId.value = listing.id
  try {
    await listingsApi.toggleFavorite(listing.id)
    favorites.value = favorites.value.filter((l) => l.id !== listing.id)
  } finally {
    removingId.value = null
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) { router.push({ name: 'login', query: { redirect: '/favoris' } }); return }
  try {
    const [favRes, catRes] = await Promise.all([listingsApi.getFavorites(), getCategories()])
    favorites.value  = favRes.data
    categories.value = catRes.data
  } catch {
    error.value = 'Impossible de charger vos favoris.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="favorites-page">
    <div class="page-hero">
      <div class="container">
        <p class="hero-kicker">Mon compte</p>
        <h1>Mes favoris</h1>
        <p class="hero-sub">Retrouvez toutes les annonces que vous avez sauvegardées.</p>
      </div>
    </div>

    <div class="container page-body">
      <!-- Loading skeleton -->
      <div v-if="loading" class="grid">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skel skel-sm"></div>
            <div class="skel skel-lg"></div>
            <div class="skel skel-md"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="empty-state">
        <p>{{ error }}</p>
        <button class="btn-retry" @click="$router.go(0)">Réessayer</button>
      </div>

      <!-- Empty -->
      <div v-else-if="favorites.length === 0" class="empty-state">
        <h2>Aucun favori pour l'instant</h2>
        <p>Parcourez les annonces et cliquez sur ❤️ pour sauvegarder vos coups de cœur.</p>
        <RouterLink to="/annonces" class="btn-browse">Parcourir les annonces</RouterLink>
      </div>

      <!-- Grid -->
      <template v-else>
        <p class="results-count">{{ favorites.length }} annonce{{ favorites.length !== 1 ? 's' : '' }} sauvegardée{{ favorites.length !== 1 ? 's' : '' }}</p>

        <div class="grid">
          <article v-for="listing in favorites" :key="listing.id" class="listing-card">
            <!-- Image -->
            <div
              class="card-image"
              :style="listing.thumbnail
                ? { backgroundImage: `url(${listing.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: cardBg(listing) }"
            >

              <!-- Remove button -->
              <button
                class="btn-unfav"
                :class="{ removing: removingId === listing.id }"
                :disabled="removingId === listing.id"
                @click.prevent="removeFavorite(listing)"
                aria-label="Retirer des favoris"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="card-body">
              <div class="card-meta">
                <span class="card-category">{{ listing.category_name || 'Autre' }}</span>
                <span class="card-date">{{ formatDate(listing.created_at) }}</span>
              </div>
              <h3 class="card-title">{{ listing.title }}</h3>
              <div class="card-price">{{ formatPrice(listing.price) }}</div>
              <div class="card-footer">
                <div class="card-location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ listing.city }}
                </div>
                <button
                  class="btn-unfav-text"
                  :disabled="removingId === listing.id"
                  @click.prevent="removeFavorite(listing)"
                >
                  {{ removingId === listing.id ? '…' : 'Retirer' }}
                </button>
              </div>
            </div>

            <RouterLink :to="`/annonces/${listing.id}`" class="card-link" :aria-label="`Voir : ${listing.title}`" />
          </article>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.favorites-page {
  min-height: calc(100svh - var(--nav-height));
  background: var(--cream);
}

.page-hero {
  background: linear-gradient(135deg, var(--forest-800), var(--forest-600));
  padding: 96px 0 48px;
  color: white;
}
.hero-kicker {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 5px 13px;
  border-radius: 100px;
  margin-bottom: 14px;
}
.page-hero h1 { color: white; font-size: clamp(26px, 4vw, 38px); margin-bottom: 10px; }
.hero-sub { color: rgba(255,255,255,0.75); font-size: 16px; }

.page-body {
  padding-top: 36px;
  padding-bottom: 72px;
}

.results-count {
  font-size: 14px;
  color: var(--gray-500);
  margin-bottom: 20px;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Card */
.listing-card {
  position: relative;
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  display: flex;
  flex-direction: column;
}
.listing-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--forest-200);
}

.card-image {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.12));
}

.card-emoji {
  font-size: 64px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
}

.btn-unfav {
  position: absolute;
  top: 10px; right: 10px;
  z-index: 2;
  width: 34px; height: 34px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  color: #f43f5e;
  transition: all 0.2s;
}
.btn-unfav svg { width: 15px; height: 15px; }
.btn-unfav:hover { transform: scale(1.1); background: #fff1f2; }
.btn-unfav.removing { opacity: 0.5; cursor: wait; }
.btn-unfav:disabled { cursor: not-allowed; }

.card-body {
  padding: 16px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-category {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--forest-600);
  background: var(--forest-50);
  padding: 3px 9px;
  border-radius: 100px;
  border: 1px solid var(--forest-100);
}

.card-date { font-size: 11.5px; color: var(--gray-400); }

.card-title {
  font-family: var(--font-body);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--gray-800);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  color: var(--forest-800);
  letter-spacing: -0.5px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--gray-100);
  margin-top: auto;
}

.card-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--gray-400);
}

.btn-unfav-text {
  font-size: 12px;
  font-weight: 600;
  color: #f43f5e;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 2;
  position: relative;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}
.btn-unfav-text:hover { background: #fff1f2; }
.btn-unfav-text:disabled { opacity: 0.5; cursor: not-allowed; }

.card-link {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.btn-unfav, .btn-unfav-text { z-index: 2; }

/* Skeleton */
.skeleton-card {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 16px;
  overflow: hidden;
}
.skeleton-img {
  height: 180px;
  animation: shimmer 1.4s infinite;
}
.skeleton-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.skel {
  height: 12px;
  border-radius: 6px;
  animation: shimmer 1.4s infinite;
}
.skel-sm { width: 40%; }
.skel-md { width: 60%; }
.skel-lg { width: 85%; height: 15px; }

@keyframes shimmer {
  from { background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%); background-position: 200% 0; background-size: 200% 100%; }
  to   { background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%); background-position: -200% 0; background-size: 200% 100%; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: var(--gray-500);
}
.empty-icon { font-size: 52px; margin-bottom: 16px; }
.empty-state h2 { color: var(--forest-900); font-size: 20px; margin-bottom: 8px; }
.empty-state p { margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto; }

.btn-browse, .btn-retry {
  display: inline-block;
  padding: 12px 28px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-browse:hover, .btn-retry:hover { background: var(--forest-800); }

@media (max-width: 1024px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .grid { grid-template-columns: 1fr; } }
</style>
