<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import * as listingsApi from '@/api/listings.js'
import { getCategories } from '@/api/categories.js'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const listings   = ref([])
const categories = ref([])
const loading    = ref(false)
const error      = ref('')
const total      = ref(0)

const PAGE_SIZE = 12

const filters = reactive({
  search:         route.query.search         || '',
  category:       route.query.category       || '',
  city:           route.query.city           || '',
  min_price:      route.query.min_price      || '',
  max_price:      route.query.max_price      || '',
  favorites_only: route.query.favorites_only === '1',
})

const page = ref(Number(route.query.page) || 1)

const filtersOpen = ref(false)

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
  if (price == null) return 'À négocier'
  return Number(price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / 86400000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  if (diff < 7)  return `Il y a ${diff}j`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function sellerInitial(name) {
  return (name || 'U').trim()[0].toUpperCase()
}

async function fetchListings() {
  loading.value = true
  error.value = ''
  try {
    if (filters.favorites_only && auth.isAuthenticated) {
      const { data } = await listingsApi.getFavorites()
      listings.value = data
    } else {
      const params = {
        offset: (page.value - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }
      if (filters.search)    params.search    = filters.search
      if (filters.category)  params.category  = filters.category
      if (filters.city)      params.city      = filters.city
      if (filters.min_price) params.min_price = filters.min_price
      if (filters.max_price) params.max_price = filters.max_price

      const { data } = await listingsApi.getListings(params)
      listings.value = data
    }
  } catch {
    error.value = 'Impossible de charger les annonces.'
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const { data } = await getCategories()
    categories.value = data
  } catch { /* silent */ }
}

function applyFilters() {
  page.value = 1
  updateQuery()
  fetchListings()
  filtersOpen.value = false
}

function resetFilters() {
  filters.search         = ''
  filters.category       = ''
  filters.city           = ''
  filters.min_price      = ''
  filters.max_price      = ''
  filters.favorites_only = false
  applyFilters()
}

function updateQuery() {
  const q = {}
  if (filters.search)         q.search         = filters.search
  if (filters.category)       q.category       = filters.category
  if (filters.city)           q.city           = filters.city
  if (filters.min_price)      q.min_price      = filters.min_price
  if (filters.max_price)      q.max_price      = filters.max_price
  if (filters.favorites_only) q.favorites_only = '1'
  if (page.value > 1)         q.page           = page.value
  router.replace({ query: q })
}

function goToPage(n) {
  page.value = n
  updateQuery()
  fetchListings()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const hasActiveFilter = computed(() =>
  filters.search || filters.category || filters.city || filters.min_price || filters.max_price || filters.favorites_only
)

onMounted(async () => {
  await loadCategories()
  await fetchListings()
})
</script>

<template>
  <main class="listings-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Toutes les annonces</h1>
        <p class="page-subtitle">Trouvez plantes, outils, services et bien plus près de chez vous</p>

        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="filters.search"
            type="search"
            placeholder="Chercher une annonce…"
            class="search-input"
            @keydown.enter="applyFilters"
          />
          <button class="search-btn" @click="applyFilters">Rechercher</button>
          <button class="filter-toggle" @click="filtersOpen = !filtersOpen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filtres
            <span v-if="hasActiveFilter" class="filter-dot"></span>
          </button>
        </div>
      </div>
    </div>

    <div class="page-body container">
      <!-- Sidebar filters -->
      <aside :class="['filters-panel', { open: filtersOpen }]">
        <div class="filters-header">
          <h2>Filtres</h2>
          <button v-if="hasActiveFilter" class="reset-btn" @click="resetFilters">Tout effacer</button>
        </div>

        <div class="filter-group">
          <label class="filter-label">Catégorie</label>
          <select v-model="filters.category" class="filter-select">
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Ville</label>
          <input v-model="filters.city" type="text" placeholder="Lyon, Paris…" class="filter-input" />
        </div>

        <div class="filter-group">
          <label class="filter-label">Prix (€)</label>
          <div class="price-range">
            <input v-model="filters.min_price" type="number" min="0" placeholder="Min" class="filter-input half" />
            <span class="price-sep">–</span>
            <input v-model="filters.max_price" type="number" min="0" placeholder="Max" class="filter-input half" />
          </div>
        </div>

        <div v-if="auth.isAuthenticated" class="filter-group filter-group--fav">
          <label class="filter-fav-toggle" :class="{ active: filters.favorites_only }">
            <input type="checkbox" v-model="filters.favorites_only" class="fav-checkbox" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Mes favoris uniquement
          </label>
        </div>

        <button class="apply-btn" @click="applyFilters">Appliquer les filtres</button>
      </aside>

      <!-- Results -->
      <div class="results-area">
        <div class="results-bar" v-if="!loading">
          <span class="results-count">
            {{ listings.length === 0 ? 'Aucune annonce' : `${listings.length} annonce${listings.length > 1 ? 's' : ''}` }}
            <template v-if="hasActiveFilter"> trouvée{{ listings.length > 1 ? 's' : '' }}</template>
          </span>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid">
          <div v-for="i in PAGE_SIZE" :key="i" class="skeleton-card">
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
          <button class="apply-btn" @click="fetchListings">Réessayer</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="listings.length === 0" class="empty-state">
          <h2>Aucune annonce trouvée</h2>
          <p>Essayez de modifier vos filtres ou revenez plus tard.</p>
          <button v-if="hasActiveFilter" class="apply-btn" @click="resetFilters">Effacer les filtres</button>
        </div>

        <!-- Grid -->
        <div v-else class="grid">
          <article
            v-for="listing in listings"
            :key="listing.id"
            class="listing-card"
          >
            <div
              class="card-image"
              :style="listing.thumbnail
                ? { backgroundImage: `url(${listing.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: cardBg(listing) }"
            >
              <span class="badge-new" v-if="(new Date() - new Date(listing.created_at)) < 86400000 * 2">Nouveau</span>
            </div>

            <div class="card-body">
              <div class="card-meta">
                <span class="card-category">{{ listing.category_name || 'Autre' }}</span>
                <span class="card-date">{{ formatDate(listing.created_at) }}</span>
              </div>
              <h3 class="card-title">{{ listing.title }}</h3>
              <div class="card-price">{{ formatPrice(listing.price) }}</div>
              <div class="card-footer">
                <div class="card-seller">
                  <span class="seller-avatar">{{ sellerInitial(listing.seller_name) }}</span>
                  <span class="seller-name">{{ listing.seller_name }}</span>
                </div>
                <div class="card-location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ listing.city }}
                </div>
              </div>
            </div>

            <RouterLink :to="`/annonces/${listing.id}`" class="card-link" :aria-label="`Voir : ${listing.title}`" />
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="listings.length === PAGE_SIZE || page > 1" class="pagination">
          <button class="page-btn" :disabled="page <= 1" @click="goToPage(page - 1)">← Précédent</button>
          <span class="page-info">Page {{ page }}</span>
          <button class="page-btn" :disabled="listings.length < PAGE_SIZE" @click="goToPage(page + 1)">Suivant →</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.listings-page {
  min-height: calc(100svh - var(--nav-height));
  background: var(--cream);
}

/* Header */
.page-header {
  background: linear-gradient(135deg, var(--forest-800) 0%, var(--forest-600) 100%);
  padding: 96px 0 48px;
  color: white;
}

.page-title {
  font-size: clamp(28px, 4vw, 42px);
  color: white;
  margin-bottom: 10px;
}

.page-subtitle {
  color: rgba(255,255,255,0.75);
  font-size: 16px;
  margin-bottom: 28px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: 14px;
  padding: 6px 6px 6px 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  max-width: 760px;
}

.search-icon {
  width: 18px; height: 18px;
  color: var(--gray-400);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--gray-800);
  background: transparent;
  min-width: 0;
}

.search-btn {
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  flex-shrink: 0;
}
.search-btn:hover { background: var(--forest-800); }

.filter-toggle {
  display: none;
  align-items: center;
  gap: 6px;
  background: var(--forest-50);
  color: var(--forest-700);
  border: 1.5px solid var(--forest-200);
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
}
.filter-toggle svg { width: 16px; height: 16px; }
.filter-dot {
  position: absolute;
  top: 6px; right: 6px;
  width: 7px; height: 7px;
  background: var(--forest-600);
  border-radius: 50%;
}

/* Layout */
.page-body {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  padding-top: 36px;
  padding-bottom: 60px;
  align-items: start;
}

/* Filters sidebar */
.filters-panel {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 18px;
  padding: 24px;
  position: sticky;
  top: 88px;
  box-shadow: var(--shadow-sm);
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.filters-header h2 {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  color: var(--forest-900);
}

.reset-btn {
  font-size: 13px;
  color: var(--forest-600);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.filter-group { margin-bottom: 20px; }

.filter-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.filter-select,
.filter-input {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid var(--gray-200);
  border-radius: 9px;
  font-size: 14px;
  color: var(--gray-800);
  background: white;
  outline: none;
  transition: border-color 0.15s;
}
.filter-select:focus,
.filter-input:focus { border-color: var(--forest-500); }

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-input.half { width: auto; flex: 1; min-width: 0; }
.price-sep { color: var(--gray-400); font-size: 14px; }

.filter-group--fav { margin-bottom: 16px; }

.filter-fav-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1.5px solid var(--gray-200);
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-600);
  transition: all 0.2s;
  user-select: none;
  width: 100%;
}
.filter-fav-toggle:hover { border-color: var(--forest-300); color: var(--forest-700); }
.filter-fav-toggle.active {
  border-color: var(--forest-500);
  background: var(--forest-50);
  color: var(--forest-700);
}
.filter-fav-toggle.active svg { fill: #ef4444; stroke: #ef4444; }
.filter-fav-toggle svg { width: 16px; height: 16px; flex-shrink: 0; }
.fav-checkbox { display: none; }

.apply-btn {
  width: 100%;
  padding: 11px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}
.apply-btn:hover { background: var(--forest-800); }

/* Results */
.results-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.results-count {
  font-size: 14px;
  color: var(--gray-500);
  font-weight: 500;
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

.badge-new {
  position: absolute;
  top: 10px; left: 10px;
  z-index: 2;
  background: white;
  color: var(--forest-700);
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 100px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

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

.card-seller { display: flex; align-items: center; gap: 8px; }

.seller-avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: var(--forest-500);
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.seller-name { font-size: 12px; font-weight: 600; color: var(--gray-700); }

.card-location {
  display: flex; align-items: center; gap: 3px;
  font-size: 11.5px; color: var(--gray-400);
}

.card-link {
  position: absolute; inset: 0; z-index: 0;
}

/* Skeleton */
.skeleton-card {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 16px;
  overflow: hidden;
}
.skeleton-img {
  height: 180px;
  background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.skel {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skel-sm { width: 40%; }
.skel-md { width: 60%; }
.skel-lg { width: 90%; height: 16px; }

@keyframes shimmer { to { background-position: -200% 0; } }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 72px 24px;
  color: var(--gray-500);
}
.empty-icon { font-size: 56px; margin-bottom: 16px; }
.empty-state h2 { color: var(--forest-900); margin-bottom: 8px; font-size: 22px; }
.empty-state p { margin-bottom: 24px; }
.empty-state .apply-btn { width: auto; padding: 11px 28px; }

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}
.page-btn {
  padding: 10px 20px;
  border: 1.5px solid var(--gray-200);
  border-radius: 10px;
  background: white;
  color: var(--gray-700);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) { border-color: var(--forest-400); color: var(--forest-700); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 14px; color: var(--gray-500); font-weight: 500; }

/* Responsive */
@media (max-width: 1024px) { .grid { grid-template-columns: repeat(2, 1fr); } }

@media (max-width: 800px) {
  .page-body { grid-template-columns: 1fr; }

  .filter-toggle { display: flex; }

  .filters-panel {
    position: static;
    display: none;
    border-radius: 14px;
    margin-bottom: 0;
  }
  .filters-panel.open { display: block; }
}

@media (max-width: 600px) {
  .search-bar { padding: 6px; flex-wrap: wrap; }
  .search-btn { order: 3; flex: 1; }
  .filter-toggle { order: 4; }
  .grid { grid-template-columns: 1fr; }
}
</style>
