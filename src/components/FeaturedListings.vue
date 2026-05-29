<script setup>
import { ref } from 'vue'

const listings = ref([
  {
    id: 1,
    title: 'Monstera Deliciosa XXL — Très belle feuille',
    price: 45,
    location: 'Lyon, 69',
    category: 'Plantes d\'intérieur',
    emoji: '🌿',
    gradient: 'linear-gradient(145deg, #1b4332, #40916c)',
    seller: 'Marie L.',
    sellerInitial: 'M',
    sellerColor: '#52b788',
    rating: 4.8,
    reviews: 23,
    daysAgo: 1,
    isNew: true,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Sécateur professionnel Felco — Comme neuf',
    price: 35,
    location: 'Paris, 75',
    category: 'Outils',
    emoji: '✂️',
    gradient: 'linear-gradient(145deg, #1e3a5f, #2563eb)',
    seller: 'Jean-Pierre M.',
    sellerInitial: 'J',
    sellerColor: '#3b82f6',
    rating: 4.9,
    reviews: 47,
    daysAgo: 2,
    isNew: false,
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Cours de taille des rosiers — Atelier 3h',
    price: 30,
    location: 'Bordeaux, 33',
    category: 'Cours & Ateliers',
    emoji: '🌹',
    gradient: 'linear-gradient(145deg, #831843, #db2777)',
    seller: 'Sophie G.',
    sellerInitial: 'S',
    sellerColor: '#db2777',
    rating: 5.0,
    reviews: 12,
    daysAgo: 3,
    isNew: false,
    isFavorite: false,
  },
  {
    id: 4,
    title: 'Graines de tomates anciennes — 8 variétés',
    price: 8,
    location: 'Nantes, 44',
    category: 'Graines & Bulbes',
    emoji: '🍅',
    gradient: 'linear-gradient(145deg, #7c2d12, #dc2626)',
    seller: 'René F.',
    sellerInitial: 'R',
    sellerColor: '#dc2626',
    rating: 4.7,
    reviews: 61,
    daysAgo: 4,
    isNew: false,
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Jardinier à domicile — Tonte, taille, entretien',
    price: 25,
    location: 'Toulouse, 31',
    category: 'Services',
    emoji: '🌳',
    gradient: 'linear-gradient(145deg, #14532d, #16a34a)',
    seller: 'Paul V.',
    sellerInitial: 'P',
    sellerColor: '#16a34a',
    rating: 4.6,
    reviews: 89,
    daysAgo: 1,
    isNew: true,
    isFavorite: false,
  },
  {
    id: 6,
    title: 'Ficus Lyrata grande taille — Pot inclus',
    price: 60,
    location: 'Marseille, 13',
    category: 'Plantes d\'intérieur',
    emoji: '🌱',
    gradient: 'linear-gradient(145deg, #2d6a4f, #52b788)',
    seller: 'Claire D.',
    sellerInitial: 'C',
    sellerColor: '#52b788',
    rating: 4.9,
    reviews: 18,
    daysAgo: 5,
    isNew: false,
    isFavorite: false,
  },
])

const toggleFav = (listing) => {
  listing.isFavorite = !listing.isFavorite
}

const formatPrice = (price) => `${price} €`
</script>

<template>
  <section class="listings-section" id="annonces">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">✨ À la une</span>
        <h2 class="section-title">Annonces récentes</h2>
        <p class="section-subtitle">Les dernières annonces de notre communauté de jardiniers passionnés</p>
      </div>

      <div class="listings-grid">
        <article v-for="listing in listings" :key="listing.id" class="listing-card">
          <!-- Image -->
          <div class="card-image" :style="{ background: listing.gradient }">
            <span class="card-emoji">{{ listing.emoji }}</span>
            <span v-if="listing.isNew" class="badge-new">Nouveau</span>
            <button
              class="btn-fav"
              :class="{ active: listing.isFavorite }"
              @click.prevent="toggleFav(listing)"
              :aria-label="listing.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            >
              <svg viewBox="0 0 24 24" :fill="listing.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="card-body">
            <div class="card-meta">
              <span class="card-category">{{ listing.category }}</span>
              <span class="card-date">{{ listing.daysAgo === 1 ? 'Hier' : `Il y a ${listing.daysAgo}j` }}</span>
            </div>

            <h3 class="card-title">{{ listing.title }}</h3>

            <div class="card-price">{{ formatPrice(listing.price) }}</div>

            <div class="card-footer">
              <div class="card-seller">
                <span class="seller-avatar" :style="{ background: listing.sellerColor }">
                  {{ listing.sellerInitial }}
                </span>
                <div class="seller-info">
                  <span class="seller-name">{{ listing.seller }}</span>
                  <span class="seller-rating">
                    ⭐ {{ listing.rating }} ({{ listing.reviews }})
                  </span>
                </div>
              </div>
              <div class="card-location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ listing.location }}
              </div>
            </div>
          </div>

          <a href="#" class="card-link" :aria-label="`Voir l'annonce : ${listing.title}`"></a>
        </article>
      </div>

      <div class="listings-footer">
        <a href="/annonces" class="btn-all">
          Voir toutes les annonces
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
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

/* Image */
.card-image {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.15));
}

.card-emoji {
  font-size: 72px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
  transition: transform 0.3s var(--ease);
}
.listing-card:hover .card-emoji { transform: scale(1.08) rotate(-4deg); }

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

.btn-fav {
  position: absolute;
  top: 12px; right: 12px;
  z-index: 2;
  width: 34px; height: 34px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.btn-fav svg { width: 15px; height: 15px; color: var(--gray-400); transition: all 0.2s; }
.btn-fav:hover svg { color: #f43f5e; transform: scale(1.15); }
.btn-fav.active svg { color: #f43f5e; }

/* Body */
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.seller-info { display: flex; flex-direction: column; gap: 1px; }
.seller-name { font-size: 12.5px; font-weight: 600; color: var(--gray-700); }
.seller-rating { font-size: 11px; color: var(--gray-400); }

.card-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--gray-400);
}
.card-location svg { color: var(--gray-300); flex-shrink: 0; }

/* Invisible full-card link */
.card-link {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.btn-fav { z-index: 2; }

/* Footer */
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
