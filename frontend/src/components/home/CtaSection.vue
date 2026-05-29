<template>
  <section class="cta-section">
    <!-- Decorative blobs -->
    <div class="cta-blobs" aria-hidden="true">
      <div class="cta-blob cta-blob--1"></div>
      <div class="cta-blob cta-blob--2"></div>
    </div>

    <!-- Leaf decorations -->
    <svg class="cta-leaf cta-leaf--l" viewBox="0 0 120 180" fill="none" aria-hidden="true">
      <path d="M60 10C90 10 110 45 110 80C110 130 80 165 60 175C40 165 10 130 10 80C10 45 30 10 60 10Z"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <path d="M60 175V80" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    </svg>
    <svg class="cta-leaf cta-leaf--r" viewBox="0 0 160 220" fill="none" aria-hidden="true">
      <path d="M80 15C115 15 145 55 145 100C145 160 110 200 80 212C50 200 15 160 15 100C15 55 45 15 80 15Z"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </svg>

    <div class="container">
      <div class="cta-inner">
        <div class="cta-content">
          <span class="cta-badge">Rejoignez la communauté</span>
          <h2 class="cta-title">
            Prêt à faire pousser<br>
            <em>votre jardin idéal</em> ?
          </h2>
          <p class="cta-desc">
            Rejoignez plus de 4 000 jardiniers passionnés. Créez votre compte gratuitement et
            commencez à acheter, vendre ou proposer vos services dès aujourd'hui.
          </p>

          <div class="cta-actions">
            <a href="/inscription" class="cta-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Créer mon compte gratuit
            </a>
            <a href="/annonces" class="cta-btn-ghost">
              Parcourir les annonces
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <p class="cta-reassurance">
            Gratuit &nbsp;·&nbsp; Sans carte bancaire &nbsp;·&nbsp; Annulation à tout moment
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.cta-section {
  position: relative;
  background: linear-gradient(145deg, var(--forest-900) 0%, var(--forest-800) 60%, var(--forest-700) 100%);
  padding: 100px 0;
  overflow: hidden;
}

.cta-blobs { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.cta-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.cta-blob--1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, var(--forest-600), transparent);
  top: -150px; right: -100px;
  opacity: 0.3;
}
.cta-blob--2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, var(--forest-500), transparent);
  bottom: -100px; left: -60px;
  opacity: 0.2;
}

.cta-leaf {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}
.cta-leaf--l { width: 120px; top: 40px; left: 40px; opacity: 0.6; }
.cta-leaf--r { width: 160px; bottom: 40px; right: 60px; opacity: 0.5; }

.cta-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.85);
  font-size: 13px;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 24px;
  display: inline-block;
}

.cta-title {
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 700;
  color: white;
  line-height: 1.15;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}
.cta-title em { font-style: italic; color: var(--forest-300); }

.cta-desc {
  font-size: 16px;
  color: rgba(255,255,255,0.65);
  line-height: 1.75;
  max-width: 500px;
  margin: 0 auto 36px;
}

.cta-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: white;
  color: var(--forest-800);
  font-size: 15px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 12px;
  transition: all 0.25s var(--ease);
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
}
.cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }

.cta-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.8);
  font-size: 15px;
  font-weight: 500;
  padding: 12px 20px;
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  transition: all 0.25s;
}
.cta-btn-ghost:hover { color: white; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); }

.cta-reassurance {
  font-size: 13px;
  color: rgba(255,255,255,0.45);
}

@media (max-width: 640px) {
  .cta-actions { flex-direction: column; align-items: stretch; text-align: center; }
  .cta-btn-primary, .cta-btn-ghost { justify-content: center; }
}
</style>
