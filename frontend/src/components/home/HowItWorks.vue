<script setup>
const steps = [
  {
    num: '01',
    icon: '📝',
    title: 'Créez votre annonce',
    desc: 'Décrivez ce que vous vendez ou proposez, ajoutez des photos, fixez votre prix et publiez en moins de 2 minutes. Notre IA peut même vous aider à rédiger.',
    accent: 'var(--forest-600)',
    bg: 'var(--forest-50)',
  },
  {
    num: '02',
    icon: '💬',
    title: 'Échangez en direct',
    desc: 'Discutez directement avec les acheteurs ou vendeurs via notre messagerie intégrée. Négociez, posez vos questions, organisez la rencontre.',
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    num: '03',
    icon: '🌱',
    title: 'Concrétisez l\'échange',
    desc: 'Récupérez votre achat ou vendez votre annonce localement, en toute confiance. Notez le vendeur et laissez un avis pour aider la communauté.',
    accent: '#d97706',
    bg: '#fffbeb',
  },
]
</script>

<template>
  <section class="how-section" id="comment-ca-marche">
    <!-- Background pattern -->
    <div class="how-bg" aria-hidden="true">
      <svg class="bg-pattern" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="80" r="60" stroke="rgba(82,183,136,0.12)" stroke-width="1"/>
        <circle cx="700" cy="320" r="100" stroke="rgba(82,183,136,0.08)" stroke-width="1"/>
        <path d="M0 200 Q400 50 800 200" stroke="rgba(82,183,136,0.06)" stroke-width="1"/>
      </svg>
    </div>

    <div class="container">
      <div class="section-header">
        <span class="section-badge">🚀 Simple & rapide</span>
        <h2 class="section-title">Comment ça marche ?</h2>
        <p class="section-subtitle">Acheter, vendre ou proposer un service se fait en quelques étapes seulement</p>
      </div>

      <div class="steps-grid">
        <div v-for="(step, i) in steps" :key="i" class="step-card">
          <!-- Number -->
          <div class="step-number-wrap" :style="{ background: step.bg }">
            <span class="step-number" :style="{ color: step.accent }">{{ step.num }}</span>
          </div>

          <!-- Icon -->
          <div class="step-icon-wrap" :style="{ background: step.bg, border: `2px solid ${step.accent}20` }">
            <span class="step-icon">{{ step.icon }}</span>
          </div>

          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>

          <!-- Connector -->
          <div v-if="i < steps.length - 1" class="step-connector">
            <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12 H68 M60 4 L76 12 L60 20" stroke="var(--forest-300)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 3"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- CTA inline -->
      <div class="how-cta">
        <a href="/deposer" class="how-btn">
          Déposer ma première annonce gratuitement
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <span class="how-note">C'est gratuit, sans inscription obligatoire pour parcourir</span>
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
.step-icon { font-size: 36px; }

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

.how-note {
  font-size: 13px;
  color: var(--gray-400);
}

@media (max-width: 900px) {
  .steps-grid { grid-template-columns: 1fr; gap: 24px; }
  .step-connector { display: none; }
}
</style>
