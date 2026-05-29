<script setup>
import { ref, onMounted } from 'vue'
import { getListings } from '@/api/listings.js'

const listings = ref([])

const cardPlants = [
  '/Plant - Gradient - Outline - 01.png',
  '/Plant - Gradient - Outline - 05.png',
  '/Plant - Gradient - Outline - 09.png',
  '/Plant - Gradient - Outline - 02.png',
  '/Plant - Gradient - Outline - 11.png',
  '/Plant - Gradient - Outline - 06.png',
]

const gradients = {
  'plantes-interieur': 'linear-gradient(145deg, #0d2b1c, #1b5e3b)',
  'plantes-fleuries':  'linear-gradient(145deg, #4a0d2b, #9b2360)',
  'graines-bulbes':    'linear-gradient(145deg, #3b2006, #8b5c1c)',
  'arbres-arbustes':   'linear-gradient(145deg, #0a2e10, #1a6e2e)',
  'outils-materiel':   'linear-gradient(145deg, #0e1e38, #1e4a8a)',
  'services-conseils': 'linear-gradient(145deg, #28106a, #5b2aaa)',
  'cours-ateliers':    'linear-gradient(145deg, #3c1608, #a03810)',
  'mobilier-jardin':   'linear-gradient(145deg, #1c2028, #48525e)',
  'autres':            'linear-gradient(145deg, #0f2e1e, #2d6a4f)',
}

function cardBg(listing) {
  return gradients[listing.category_slug] || 'linear-gradient(145deg, #0f2e1e, #2d6a4f)'
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
        <article v-for="(listing, idx) in listings" :key="listing.id" class="lcard">

          <!-- Image area -->
          <div
            class="lcard-img"
            :style="listing.thumbnail
              ? { backgroundImage: `url(${listing.thumbnail})`, backgroundSize:'cover', backgroundPosition:'center' }
              : { background: cardBg(listing) }"
          >
            <!-- Decorative plant on gradient cards (no thumbnail) -->
            <img
              v-if="!listing.thumbnail"
              :src="cardPlants[idx % cardPlants.length]"
              class="lcard-plant"
              aria-hidden="true"
            />
            <span
              v-if="(new Date() - new Date(listing.created_at)) < 86400000*2"
              class="badge-new"
            >Nouveau</span>
            <div class="lcard-img-overlay"></div>
          </div>

          <!-- Body -->
          <div class="lcard-body">
            <div class="lcard-meta">
              <span class="lcard-cat">{{ listing.category_name || 'Autre' }}</span>
              <span class="lcard-date">{{ formatDate(listing.created_at) }}</span>
            </div>
            <h3 class="lcard-title">{{ listing.title }}</h3>
            <div class="lcard-price">{{ formatPrice(listing.price) }}</div>

            <div class="lcard-footer">
              <div class="lcard-seller">
                <span class="seller-av">{{ sellerInitial(listing.seller_name) }}</span>
                <span class="seller-name">{{ listing.seller_name }}</span>
              </div>
              <div class="lcard-loc">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ listing.city }}
              </div>
            </div>
          </div>

          <RouterLink :to="`/annonces/${listing.id}`" class="lcard-link" :aria-label="`Voir : ${listing.title}`" />
        </article>
      </div>

      <div class="listings-footer">
        <RouterLink to="/annonces" class="btn-all">
          Voir toutes les annonces
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.lcard {
  position: relative;
  background: white;
  border: 1.5px solid #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
  display: flex; flex-direction: column;
  transition: all 0.32s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.lcard:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 56px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.07);
  border-color: #b7e4c7;
}
.lcard:hover .lcard-plant { transform: scale(1.06) translateY(-4px); }

.lcard-img {
  position: relative;
  height: 210px; overflow: hidden;
  display: flex; align-items: flex-end;
}
.lcard-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.2));
}
.lcard-plant {
  position: absolute;
  right: -10px; bottom: -10px;
  width: 52%;
  height: auto; object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  opacity: 0.75;
  transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none; user-select: none;
}

.badge-new {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  background: white; color: #2d6a4f;
  font-size: 10.5px; font-weight: 700;
  padding: 4px 10px; border-radius: 100px;
  letter-spacing: 0.5px; text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.lcard-body {
  padding: 18px 18px 16px;
  display: flex; flex-direction: column; gap: 10px; flex: 1;
}
.lcard-meta {
  display: flex; align-items: center; justify-content: space-between;
}
.lcard-cat {
  font-size: 11.5px; font-weight: 600; color: #40916c;
  background: #f0fdf4; padding: 3px 10px;
  border-radius: 100px; border: 1px solid #b7e4c7;
}
.lcard-date {
  font-size: 11.5px; color: #9ca3af;
}
.lcard-title {
  font-family: var(--font-body);
  font-size: 15px; font-weight: 600;
  color: #1f2937; line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.lcard-price {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px; font-weight: 700;
  color: #1b4332; letter-spacing: -0.5px;
}
.lcard-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: auto; padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}
.lcard-seller { display: flex; align-items: center; gap: 8px; }
.seller-av {
  width: 28px; height: 28px; border-radius: 50%;
  background: #52b788; color: white;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.seller-name { font-size: 12.5px; font-weight: 600; color: #374151; }
.lcard-loc {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; color: #9ca3af;
}
.lcard-link {
  position: absolute; inset: 0; z-index: 1;
}

.listings-footer { text-align: center; margin-top: 52px; }
.btn-all {
  display: inline-flex; align-items: center; gap: 8px;
  background: #1b4332; color: white;
  font-size: 15px; font-weight: 600;
  padding: 14px 30px; border-radius: 14px;
  transition: all 0.25s;
}
.btn-all:hover {
  background: #2d6a4f; transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(27,67,50,0.28);
}

@media (max-width: 1024px) { .listings-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 640px)  { .listings-grid { grid-template-columns: 1fr; } }
</style>
