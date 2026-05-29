<script setup>
import { ref, onMounted } from 'vue'

const steps = [
  {
    num: '01',
    title: 'Créez votre annonce',
    desc: 'Décrivez ce que vous vendez ou proposez, ajoutez des photos, fixez votre prix et publiez en quelques minutes.',
    plant: '/Plant - Outline - 03.png',
    accent: '#2d6a4f',
    light: '#f0fdf4',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  },
  {
    num: '02',
    title: 'Échangez en direct',
    desc: 'Discutez directement avec les acheteurs ou vendeurs via notre messagerie intégrée. Négociez en toute confiance.',
    plant: '/Plant - Outline - 07.png',
    accent: '#1e4a8a',
    light: '#eff6ff',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    num: '03',
    title: 'Concrétisez l\'échange',
    desc: 'Récupérez votre achat ou vendez localement, en toute confiance, au sein de la communauté de jardiniers.',
    plant: '/Plant - Outline - 11.png',
    accent: '#8b5c1c',
    light: '#fffbeb',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  },
]

const visible = ref(false)
const sectionRef = ref(null)

onMounted(() => {
  const obs = new IntersectionObserver(
    e => { if (e[0].isIntersecting) visible.value = true },
    { threshold: 0.15 }
  )
  if (sectionRef.value) obs.observe(sectionRef.value)
})
</script>

<template>
  <section class="how-section" id="comment-ca-marche" ref="sectionRef">
    <!-- Decorative background plants -->
    <div class="how-bg-deco" aria-hidden="true">
      <img src="/Plant - Gradient - Outline - 02.png" class="hbd-1" />
      <img src="/Plant - Gradient - Outline - 08.png" class="hbd-2" />
    </div>

    <!-- Top wave -->
    <div class="how-wave-top" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" fill="white"/>
      </svg>
    </div>

    <div class="container">
      <div class="section-header">
        <span class="section-badge">Simple et rapide</span>
        <h2 class="section-title">Comment ça marche ?</h2>
        <p class="section-subtitle">Acheter, vendre ou proposer un service se fait en quelques étapes seulement</p>
      </div>

      <div class="steps-grid" :class="{ visible }">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="step-card"
          :style="{ '--delay': `${i * 0.15}s`, '--accent': step.accent, '--light': step.light }"
        >
          <!-- Step number -->
          <div class="step-num">{{ step.num }}</div>

          <!-- Plant illustration -->
          <div class="step-plant-wrap">
            <img :src="step.plant" class="step-plant" :alt="step.title" />
          </div>

          <!-- Icon -->
          <div class="step-icon-wrap" :style="{ background: step.light }">
            <span class="step-icon" v-html="step.icon" :style="{ color: step.accent }"></span>
          </div>

          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>

          <!-- Connector arrow -->
          <div v-if="i < steps.length - 1" class="step-connector">
            <svg viewBox="0 0 56 24" fill="none">
              <path d="M0 12 H44" :stroke="step.accent" stroke-width="1.5" stroke-dasharray="5 3" stroke-linecap="round"/>
              <path d="M38 5 L50 12 L38 19" :stroke="step.accent" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="how-cta">
        <RouterLink to="/deposer" class="how-btn">
          Déposer ma première annonce
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </div>

    <!-- Bottom wave -->
    <div class="how-wave-bot" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0,30 C240,0 480,60 720,30 C960,0 1200,60 1440,30 L1440,60 L0,60 Z" fill="white"/>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.how-section {
  padding: 80px 0;
  background: #f7faf4;
  position: relative;
  overflow: hidden;
}

.how-bg-deco {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
}
.hbd-1 { position: absolute; left: -80px; top: 50%; transform: translateY(-50%); width: 280px; opacity: 0.06; }
.hbd-2 { position: absolute; right: -80px; top: 50%; transform: translateY(-50%) scaleX(-1); width: 320px; opacity: 0.05; }

.how-wave-top {
  position: absolute; top: -2px; left: 0; right: 0;
  line-height: 0; z-index: 1;
}
.how-wave-top svg { width: 100%; height: 60px; }
.how-wave-bot {
  position: absolute; bottom: -2px; left: 0; right: 0;
  line-height: 0; z-index: 1;
}
.how-wave-bot svg { width: 100%; height: 60px; }

.container { position: relative; z-index: 2; }

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 60px;
  position: relative;
}

.step-card {
  background: white;
  border: 1.5px solid #e8f5ec;
  border-radius: 24px;
  padding: 36px 28px 32px;
  position: relative;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  overflow: hidden;
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.6s var(--delay), transform 0.6s var(--delay),
              box-shadow 0.3s, border-color 0.3s;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
}
.steps-grid.visible .step-card {
  opacity: 1; transform: translateY(0);
}
.step-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(0,0,0,0.1);
  border-color: var(--accent, #2d6a4f) !important;
}
.step-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--accent, #2d6a4f);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s;
}
.step-card:hover::before { transform: scaleX(1); }

.step-num {
  position: absolute; top: 18px; right: 20px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 60px; font-weight: 700; font-style: italic;
  color: var(--accent, #2d6a4f);
  opacity: 0.07; line-height: 1; pointer-events: none;
  user-select: none;
}

.step-plant-wrap {
  width: 90px; height: 90px;
  display: flex; align-items: center; justify-content: center;
}
.step-plant {
  width: 100%; height: 100%; object-fit: contain;
  opacity: 0.65;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.step-icon-wrap {
  width: 60px; height: 60px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  margin-top: -8px;
  transition: transform 0.3s;
}
.step-card:hover .step-icon-wrap { transform: scale(1.1); }
.step-icon { display: flex; }
.step-icon :deep(svg) { width: 26px; height: 26px; }

.step-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px; font-weight: 700;
  color: #0f2b1b; letter-spacing: -0.3px;
}
.step-desc {
  font-size: 14px; color: #6b7280; line-height: 1.75; max-width: 280px;
}

.step-connector {
  position: absolute; right: -42px; top: 50%;
  transform: translateY(-50%); width: 56px; z-index: 5;
}
.step-connector svg { width: 100%; }

.how-cta { text-align: center; }
.how-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: #1b4332; color: white;
  font-size: 16px; font-weight: 600;
  padding: 15px 32px; border-radius: 14px;
  transition: all 0.25s;
}
.how-btn:hover {
  background: #2d6a4f; transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(27,67,50,0.28);
}

@media (max-width: 900px) {
  .steps-grid { grid-template-columns: 1fr; gap: 20px; }
  .step-connector { display: none; }
}
</style>
