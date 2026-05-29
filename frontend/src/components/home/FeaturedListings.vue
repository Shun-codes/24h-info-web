<script setup>
import { ref, onMounted } from 'vue'
import { getListings } from '@/api/listings.js'

const listings = ref([])

const gradients = {
  'plantes-interieur': 'linear-gradient(145deg, #1b4332, #40916c)',
  'plantes-fleuries':  'linear-gradient(145deg, #831843, #db2777)',
  'graines-bulbes':    'linear-gradient(145deg, #7c2d12, #dc2626)',
  'arbres-arbustes':   'linear-gradient(145deg, #14532d, #16a34a)',
  'outils-materiel':   'linear-gradient(145deg, #1e3a5f, #2563eb)',
  'services-conseils': 'linear-gradient(145deg, #4c1d95, #7c3aed)',
  'cours-ateliers':    'linear-gradient(145deg, #7c2d12, #ea580c)',
  'mobilier-jardin':   'linear-gradient(145deg, #374151, #6b7280)',
  'autres':            'linear-gradient(145deg, #2d6a4f, #52b788)',
}

function cardBg(listing) {
  return gradients[listing.category_slug] || 'linear-gradient(145deg, #2d6a4f, #52b788)'
}

function formatPrice(price) {
  if (price == null) return 'Gratuit'
  return Number(price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(d) {
  const diff = Math.floor((new Date() - new Date(d)) / 86400000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  return `Il y a ${diff}j`
}

function sellerInitial(name) {
  return (name || 'U').trim()[0].toUpperCase()
}

onMounted(async () => {
  try {
    const { data } = await getListings({ limit: 6 })
    listings.value = data
  } catch { /* silent */ }
})
</script>

<template>
  <section class="listings-section" id="annonces" v-if="listings.length > 0">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">À la une</span>
        <h2 class="section-title">Annonces récentes</h2>
        <p class="section-subtitle">Les dernières annonces de notre communauté de jardiniers passionnés</p>
      </div>

      <div class="listings-grid">
        <article v-for="listing in listings" :key="listing.id" class="listing-card">
          <!-- Image -->
          <div
            class="card-image"
            :style="listing.thumbnail
              ? { backgroundImage: `url(${listing.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: cardBg(listing) }"
          >
            <span
              v-if="(new Date() - new Date(listing.created_at)) < 86400000 * 2"
              class="badge-new"
            >Nouveau</span>
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
              <div class="card-seller">
                <span class="seller-avatar">{{ sellerInitial(listing.seller_name) }}</span>
                <div class="seller-info">
                  <span class="seller-name">{{ listing.seller_name }}</span>
                </div>
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

      <div class="listings-footer">
        <RouterLink to="/annonces" class="btn-all">
          Voir toutes les annonces
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.listings-section {
  padding: 96px 0;
  background: white;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--forest-50);
  border: 1.5px solid var(--forest-200);
  color: var(--forest-700);
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 18px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.listing-card {
  position: relative;
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  display: flex;
  flex-direction: column;
}
.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
  border-color: var(--forest-200);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.15));
}

.badge-new {
  position: absolute;
  top: 12px; left: 12px;
  z-index: 2;
  background: white;
  color: var(--forest-700);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.card-body {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-category {
  font-size: 12px;
  font-weight: 600;
  color: var(--forest-600);
  background: var(--forest-50);
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid var(--forest-100);
}

.card-date {
  font-size: 12px;
  color: var(--gray-400);
}

.card-title {
  font-family: var(--font-body);
  font-size: 15px;
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
  font-size: 22px;
  font-weight: 700;
  color: var(--forest-800);
  letter-spacing: -0.5px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--gray-100);
}

.card-seller { display: flex; align-items: center; gap: 9px; }

.seller-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--forest-500);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.seller-info { display: flex; flex-direction: column; gap: 1px; }
.seller-name { font-size: 12.5px; font-weight: 600; color: var(--gray-700); }

.card-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--gray-400);
}
.card-location svg { color: var(--gray-300); flex-shrink: 0; }

.card-link {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.listings-footer {
  text-align: center;
  margin-top: 48px;
}
.btn-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--forest-700);
  color: white;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 12px;
  transition: all 0.25s var(--ease);
}
.btn-all:hover { background: var(--forest-800); transform: translateY(-2px); box-shadow: var(--shadow-green); }

@media (max-width: 1024px) { .listings-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .listings-grid { grid-template-columns: 1fr; } }
</style>
