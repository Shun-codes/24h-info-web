<script setup>
import { ref, onMounted } from 'vue'
import { getCategories } from '@/api/categories.js'

const categories = ref([])

const gradients = {
  'plantes-interieur': 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
  'plantes-fleuries':  'linear-gradient(135deg, #831843 0%, #be185d 100%)',
  'graines-bulbes':    'linear-gradient(135deg, #713f12 0%, #d97706 100%)',
  'arbres-arbustes':   'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
  'outils-materiel':   'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
  'services-conseils': 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
  'cours-ateliers':    'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
  'mobilier-jardin':   'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
  'autres':            'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)',
}

function catGradient(slug) {
  return gradients[slug] || 'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)'
}

function catInitial(name) {
  return (name || '?').trim()[0].toUpperCase()
}

onMounted(async () => {
  try {
    const { data } = await getCategories()
    categories.value = data
  } catch { /* silent */ }
})
</script>

<template>
  <section class="categories-section" id="categories">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">Explorer</span>
        <h2 class="section-title">Toutes les catégories</h2>
        <p class="section-subtitle">Des plantes aux services, trouvez exactement ce dont vous avez besoin</p>
      </div>

      <div class="categories-grid">
        <RouterLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/annonces?category=${cat.slug}`"
          class="cat-card"
        >
          <div class="cat-bg" :style="{ background: catGradient(cat.slug) }">
            <span class="cat-initial">{{ catInitial(cat.name) }}</span>
            <div class="cat-glow"></div>
          </div>
          <div class="cat-info">
            <span class="cat-name">{{ cat.name }}</span>
          </div>
          <svg class="cat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>

      <div class="see-all">
        <RouterLink to="/annonces" class="see-all-btn">
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
.categories-section {
  padding: 96px 0;
  background: var(--cream);
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.28s var(--ease);
  position: relative;
  overflow: hidden;
  text-decoration: none;
}

.cat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--forest-50);
  opacity: 0;
  transition: opacity 0.25s;
}

.cat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--forest-300);
}
.cat-card:hover::before { opacity: 1; }
.cat-card:hover .cat-arrow { opacity: 1; transform: translateX(0); }

.cat-bg {
  width: 52px; height: 52px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.cat-glow {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.12);
  border-radius: 12px;
}

.cat-initial {
  font-size: 20px;
  font-weight: 800;
  color: rgba(255,255,255,0.9);
  position: relative;
  z-index: 1;
  font-family: var(--font-heading);
}

.cat-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.cat-name {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cat-arrow {
  width: 16px; height: 16px;
  color: var(--forest-600);
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.25s var(--ease);
  position: relative;
  z-index: 1;
}

.see-all {
  text-align: center;
  margin-top: 44px;
}

.see-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--forest-700);
  font-size: 15px;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid var(--forest-200);
  border-radius: 12px;
  transition: all 0.25s var(--ease);
  background: white;
}
.see-all-btn:hover {
  background: var(--forest-700);
  color: white;
  border-color: var(--forest-700);
  transform: translateY(-2px);
  box-shadow: var(--shadow-green);
}

@media (max-width: 1024px) { .categories-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px)  { .categories-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
@media (max-width: 480px)  { .categories-grid { grid-template-columns: 1fr; } }
</style>
