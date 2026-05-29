<script setup>
import { ref, onMounted } from 'vue'
import { getCategories } from '@/api/categories.js'
import { useScrollParallax, parallaxStyle } from '@/composables/useScrollParallax.js'

const sectionRef = ref(null)
const sy  = useScrollParallax()
const cdL = parallaxStyle(sectionRef, sy, 0.14)
const cdR = parallaxStyle(sectionRef, sy, 0.09)

const categories = ref([])

const plantMap = {
  'plantes-interieur': '/Plant - Flat - 01.png',
  'plantes-fleuries':  '/Plant - Flat - 04.png',
  'graines-bulbes':    '/Plant - Flat - 02.png',
  'arbres-arbustes':   '/Plant - Flat - 10.png',
  'outils-materiel':   '/Plant - Flat - 05.png',
  'services-conseils': '/Plant - Flat - 08.png',
  'cours-ateliers':    '/Plant - Flat - 06.png',
  'mobilier-jardin':   '/Plant - Flat - 09.png',
  'autres':            '/Plant - Flat - 11.png',
}
const fallback = ['/Plant - Flat - 03.png', '/Plant - Flat - 07.png']

function plantImg(slug, i) {
  return plantMap[slug] || fallback[i % fallback.length]
}

const bgMap = {
  'plantes-interieur': ['#0d2b1c','#1b5e3b'],
  'plantes-fleuries':  ['#4a0d2b','#9b2360'],
  'graines-bulbes':    ['#3b2006','#8b5c1c'],
  'arbres-arbustes':   ['#0a2e10','#1a6e2e'],
  'outils-materiel':   ['#0e1e38','#1e4a8a'],
  'services-conseils': ['#28106a','#5b2aaa'],
  'cours-ateliers':    ['#3c1608','#a03810'],
  'mobilier-jardin':   ['#1c2028','#48525e'],
  'autres':            ['#0f2e1e','#2d6a4f'],
}
function catBg(slug) {
  const [a, b] = bgMap[slug] || ['#0f2e1e','#2d6a4f']
  return `linear-gradient(160deg, ${a} 0%, ${b} 100%)`
}

onMounted(async () => {
  try {
    const { data } = await getCategories()
    categories.value = data
  } catch { /* silent */ }
})
</script>

<template>
  <section class="cat-section" id="categories" ref="sectionRef">
    <div class="cat-bg-deco" aria-hidden="true">
      <img src="/Plant - Flat - 04.png"              class="cat-deco-plant cdp-l" :style="cdL" />
      <img src="/Plant - Gradient - Outline - 08.png" class="cat-deco-plant cdp-r" :style="cdR" />
    </div>

    <div class="container">
      <div class="section-header">
        <span class="section-badge">Explorer</span>
        <h2 class="section-title">Toutes les catégories</h2>
        <p class="section-subtitle">Des plantes aux services, trouvez exactement ce dont vous avez besoin</p>
      </div>

      <div class="cat-grid">
        <RouterLink
          v-for="(cat, i) in categories"
          :key="cat.slug"
          :to="`/annonces?category=${cat.slug}`"
          class="cat-card"
        >
          <div class="cat-card-bg" :style="{ background: catBg(cat.slug) }"></div>
          <div class="cat-shimmer"></div>

          <div class="cat-plant-area">
            <img
              :src="plantImg(cat.slug, i)"
              class="cat-plant"
              :alt="cat.name"
            />
          </div>

          <div class="cat-footer">
            <span class="cat-name">{{ cat.name }}</span>
            <div class="cat-arrow-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="see-all">
        <RouterLink to="/annonces" class="see-all-btn">
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
.cat-section {
  padding: 100px 0 96px;
  background: #f7faf4;
  position: relative;
  overflow: hidden;
}

.cat-bg-deco {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
}
.cat-deco-plant { position: absolute; width: 360px; height: auto; opacity: 0.12; will-change: transform; pointer-events: none; user-select: none; }
.cdp-l { bottom: -40px; left: -60px; rotate: -20deg; }
.cdp-r { top: -40px; right: -60px; scale: -1 1; rotate: -15deg; }

.container { position: relative; z-index: 1; }

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.cat-card {
  position: relative;
  border-radius: 20px;
  aspect-ratio: 3/4;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.4s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.35s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.cat-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 24px 56px rgba(0,0,0,0.22);
}
.cat-card:hover .cat-plant { transform: scale(1.1) translateY(-6px); }
.cat-card:hover .cat-arrow-wrap { opacity: 1; transform: translateX(4px); }
.cat-card:hover .cat-shimmer { opacity: 1; }

.cat-card-bg {
  position: absolute; inset: 0; z-index: 0;
}

.cat-shimmer {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.35s;
}

.cat-plant-area {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 16px 12px 64px;
  z-index: 2;
}
.cat-plant {
  width: 75%; height: 75%; object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
  filter: drop-shadow(0 12px 24px rgba(0,0,0,0.3));
}

.cat-footer {
  position: absolute; bottom: 0; left: 0; right: 0;
  z-index: 3;
  padding: 12px 16px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
  display: flex; align-items: center; justify-content: space-between;
}

.cat-name {
  font-size: 13.5px; font-weight: 700;
  color: white; letter-spacing: 0.2px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.4);
}

.cat-arrow-wrap {
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  color: white; opacity: 0; transform: translateX(-6px);
  transition: all 0.3s;
  flex-shrink: 0;
}

.see-all {
  text-align: center; margin-top: 52px;
}
.see-all-btn {
  display: inline-flex; align-items: center; gap: 8px;
  border: 2px solid #2d6a4f; color: #2d6a4f;
  font-size: 15px; font-weight: 600;
  padding: 13px 28px; border-radius: 14px;
  background: white;
  transition: all 0.28s;
}
.see-all-btn:hover {
  background: #2d6a4f; color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(27,67,50,0.22);
}

@media (max-width: 1100px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px)  { .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
@media (max-width: 420px)  { .cat-grid { grid-template-columns: 1fr; } }
</style>
