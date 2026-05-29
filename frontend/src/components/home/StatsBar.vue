<script setup>
import { ref, onMounted } from 'vue'
import { useScrollParallax, parallaxStyle } from '@/composables/useScrollParallax.js'

const sectionRef = ref(null)
const sy         = useScrollParallax()
const spL        = parallaxStyle(sectionRef, sy, 0.10)
const spR        = parallaxStyle(sectionRef, sy, 0.07)

const stats = [
  { value: 1200, suffix: '+', label: 'Annonces actives',    detail: 'mises à jour chaque jour' },
  { value: 4000, suffix: '+', label: 'Jardiniers inscrits', detail: 'partout en France' },
  { value: 12,   suffix: '',  label: 'Catégories',          detail: 'plantes, outils, services…' },
  { value: 98,   suffix: '%', label: 'Échanges réussis',    detail: 'satisfaction garantie' },
]

const counts  = ref(stats.map(() => 0))
const started = ref(false)

function runCounters() {
  if (started.value) return
  started.value = true
  stats.forEach((stat, i) => {
    const duration = 1600 + i * 120
    const start = performance.now()
    function frame(now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      counts.value[i] = Math.round(stat.value * eased)
      if (p < 1) requestAnimationFrame(frame)
    }
    setTimeout(() => requestAnimationFrame(frame), i * 80)
  })
}

onMounted(() => {
  const obs = new IntersectionObserver(
    e => { if (e[0].isIntersecting) runCounters() },
    { threshold: 0.25 }
  )
  if (sectionRef.value) obs.observe(sectionRef.value)
})
</script>

<template>
  <section class="stats-section" ref="sectionRef">
    <div class="stat-plants" aria-hidden="true">
      <img src="/Plant - Flat - 06.png"              class="sp sp-l" :style="spL" />
      <img src="/Plant - Gradient - Outline - 09.png" class="sp sp-r" :style="spR" />
    </div>

    <div class="container stats-inner">
      <div v-for="(stat, i) in stats" :key="i" class="stat-item">
        <div class="stat-num">
          {{ counts[i].toLocaleString('fr-FR') }}<span class="stat-suf">{{ stat.suffix }}</span>
        </div>
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-detail">{{ stat.detail }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  background: #f7faf4;
  padding: 72px 0 64px;
  border-bottom: 1px solid #ddeedd;
  position: relative;
  overflow: hidden;
}

.stat-plants {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
}
.sp { position: absolute; height: 140%; width: auto; opacity: 0.14; top: -20%; will-change: transform; pointer-events: none; user-select: none; }
.sp-l { left: -2%; transform-origin: bottom left; rotate: -15deg; }
.sp-r { right: -2%; scale: -1 1; rotate: -15deg; }

.stats-inner {
  position: relative; z-index: 1;
  display: flex; align-items: stretch; justify-content: space-between; gap: 0;
}

.stat-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 0 28px; position: relative;
  text-align: center;
}
.stat-item:not(:last-child)::after {
  content: '';
  position: absolute; right: 0; top: 10%; bottom: 10%;
  width: 1px; background: #cce4cf;
}

.stat-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(40px, 5.5vw, 70px);
  font-weight: 700; letter-spacing: -2px; line-height: 1;
  color: #0f2b1b;
}
.stat-suf {
  font-size: 0.5em; color: #40916c;
  letter-spacing: 0; font-weight: 700;
  vertical-align: super; margin-left: 2px;
}

.stat-label {
  font-size: 14px; font-weight: 600; color: #2d6a4f; letter-spacing: 0.3px;
}

.stat-detail {
  font-size: 12px; color: #9ca3af; font-weight: 400;
}

@media (max-width: 720px) {
  .stats-inner { flex-wrap: wrap; }
  .stat-item { flex: 1 1 50%; padding: 20px 12px; }
  .stat-item:nth-child(2)::after { display: none; }
  .stat-item:nth-child(3)::after { display: none; }
}
@media (max-width: 400px) {
  .stat-item { flex: 1 1 100%; }
  .stat-item::after { display: none !important; }
}
</style>
