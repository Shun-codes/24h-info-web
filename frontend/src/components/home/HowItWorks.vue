<script setup>
const steps = [
  {
    num: '01',
    title: 'Créez votre annonce',
    desc: 'Décrivez ce que vous vendez ou proposez, ajoutez des photos, fixez votre prix et publiez en quelques minutes.',
    accent: 'var(--forest-600)',
    bg: 'var(--forest-50)',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  },
  {
    num: '02',
    title: 'Échangez en direct',
    desc: 'Discutez directement avec les acheteurs ou vendeurs via notre messagerie intégrée. Négociez et organisez la rencontre.',
    accent: '#2563eb',
    bg: '#eff6ff',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    num: '03',
    title: 'Concrétisez l\'échange',
    desc: 'Récupérez votre achat ou vendez votre annonce localement, en toute confiance, au sein de la communauté.',
    accent: '#d97706',
    bg: '#fffbeb',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  },
]
</script>

<template>
  <section class="how-section" id="comment-ca-marche">
    <div class="how-bg" aria-hidden="true">
      <svg class="bg-pattern" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="80" r="60" stroke="rgba(82,183,136,0.12)" stroke-width="1"/>
        <circle cx="700" cy="320" r="100" stroke="rgba(82,183,136,0.08)" stroke-width="1"/>
        <path d="M0 200 Q400 50 800 200" stroke="rgba(82,183,136,0.06)" stroke-width="1"/>
      </svg>
    </div>

    <div class="container">
      <div class="section-header">
        <span class="section-badge">Simple et rapide</span>
        <h2 class="section-title">Comment ça marche ?</h2>
        <p class="section-subtitle">Acheter, vendre ou proposer un service se fait en quelques étapes seulement</p>
      </div>

      <div class="steps-grid">
        <div v-for="(step, i) in steps" :key="i" class="step-card">
          <div class="step-number-wrap" :style="{ background: step.bg }">
            <span class="step-number" :style="{ color: step.accent }">{{ step.num }}</span>
          </div>

          <div class="step-icon-wrap" :style="{ background: step.bg, border: `2px solid ${step.accent}20` }">
            <span class="step-icon" v-html="step.icon" :style="{ color: step.accent }"></span>
          </div>

          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>

          <div v-if="i < steps.length - 1" class="step-connector">
            <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12 H68 M60 4 L76 12 L60 20" stroke="var(--forest-300)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 3"/>
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
  </section>
</template>

<style scoped>
.how-section {
  padding: 96px 0;
  background: white;
  position: relative;
  overflow: hidden;
}

.how-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.bg-pattern { width: 100%; height: 100%; object-fit: cover; }

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

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  position: relative;
  z-index: 1;
  margin-bottom: 56px;
}

.step-card {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 20px;
  padding: 32px 28px;
  position: relative;
  transition: all 0.3s var(--ease);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.step-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--forest-200);
}

.step-number-wrap {
  position: absolute;
  top: 20px; left: 20px;
  border-radius: 10px;
  padding: 4px 10px;
}
.step-number {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.step-icon-wrap {
  width: 72px; height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}
.step-icon { display: flex; align-items: center; justify-content: center; }
.step-icon :deep(svg) { width: 32px; height: 32px; }

.step-title {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  color: var(--forest-900);
}

.step-desc {
  font-size: 14.5px;
  color: var(--gray-500);
  line-height: 1.75;
}

.step-connector {
  position: absolute;
  right: -48px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  z-index: 2;
}
.step-connector svg { width: 100%; }

.how-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.how-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--forest-700);
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 15px 32px;
  border-radius: 14px;
  transition: all 0.25s var(--ease);
}
.how-btn:hover { background: var(--forest-800); transform: translateY(-2px); box-shadow: var(--shadow-green); }

@media (max-width: 900px) {
  .steps-grid { grid-template-columns: 1fr; gap: 24px; }
  .step-connector { display: none; }
}
</style>
