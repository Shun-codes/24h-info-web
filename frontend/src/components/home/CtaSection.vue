<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
const sectionRef = ref(null)

onMounted(() => {
  const obs = new IntersectionObserver(
    e => { if (e[0].isIntersecting) visible.value = true },
    { threshold: 0.2 }
  )
  if (sectionRef.value) obs.observe(sectionRef.value)
})
</script>

<template>
  <section class="cta-section" ref="sectionRef" :class="{ visible }">
    <!-- Background base -->
    <div class="cta-bg"></div>
    <div class="cta-radial"></div>

    <!-- Large plant silhouettes -->
    <div class="cta-plants" aria-hidden="true">
      <img src="/Plant - Flat - 02.png"  class="cp cp-l1 sw1" />
      <img src="/Plant - Flat - 08.png"  class="cp cp-l2 sw3" />
      <img src="/Plant - Flat - 05.png"  class="cp cp-r1 sw2" />
      <img src="/Plant - Flat - 10.png"  class="cp cp-r2 sw1" />
    </div>

    <!-- Gradient outline plants (more colorful) -->
    <div class="cta-plants-accent" aria-hidden="true">
      <img src="/Plant - Gradient - Outline - 04.png" class="cpa cpa-l" />
      <img src="/Plant - Gradient - Outline - 11.png" class="cpa cpa-r" />
    </div>

    <!-- Gold line decorations -->
    <div class="gold-line gold-line-1"></div>
    <div class="gold-line gold-line-2"></div>

    <!-- Content -->
    <div class="container cta-inner">
      <div class="cta-content">
        <div class="cta-eyebrow">
          <span class="cta-ep"></span>
          Rejoignez la communauté
        </div>

        <h2 class="cta-title">
          Prêt à faire pousser<br>
          <em>votre jardin idéal&nbsp;?</em>
        </h2>

        <p class="cta-desc">
          Rejoignez plus de 4&nbsp;000 jardiniers passionnés. Créez votre
          compte gratuitement et commencez à acheter, vendre ou proposer
          vos services dès aujourd'hui.
        </p>

        <div class="cta-actions">
          <RouterLink to="/inscription" class="cta-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Créer mon compte gratuit
          </RouterLink>
          <RouterLink to="/annonces" class="cta-btn-ghost">
            Parcourir les annonces
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>

        <p class="cta-reassurance">
          Gratuit &nbsp;·&nbsp; Sans carte bancaire &nbsp;·&nbsp; Annulation à tout moment
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  position: relative;
  padding: 120px 0 140px;
  overflow: hidden;
}

.cta-bg {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #040d07 0%, #07150a 30%, #0c2016 65%, #0f2a1c 100%);
  z-index: 0;
}
.cta-radial {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 50%,
    rgba(22,55,35,0.7) 0%, transparent 70%);
  z-index: 0;
}

/* Plant layers */
.cta-plants {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
}
.cp { position: absolute; height: auto; }
.cp-l1 { width: min(28vw, 340px); bottom: -20px; left: -30px; opacity: 0.5; filter: brightness(0.7); }
.cp-l2 { width: min(18vw, 220px); bottom: 10%;   left: 12%;   opacity: 0.3; filter: brightness(0.6); }
.cp-r1 { width: min(26vw, 320px); bottom: -20px; right: -20px; opacity: 0.5; filter: brightness(0.7); transform: scaleX(-1); }
.cp-r2 { width: min(16vw, 200px); bottom: 12%;   right: 14%;   opacity: 0.3; filter: brightness(0.6); transform: scaleX(-1); }

.cta-plants-accent {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
}
.cpa { position: absolute; height: auto; }
.cpa-l { width: min(22vw, 280px); top: -30px;  left: -40px; opacity: 0.15; }
.cpa-r { width: min(20vw, 260px); top: -20px;  right: -30px; opacity: 0.15; transform: scaleX(-1); }

/* Sway animations (redefine here since scoped) */
.sw1 { animation: sw1 10s ease-in-out infinite; transform-origin: bottom center; }
.sw2 { animation: sw2 13s ease-in-out infinite; transform-origin: bottom center; }
.sw3 { animation: sw3 8s  ease-in-out infinite; transform-origin: bottom center; }

@keyframes sw1 {
  0%,100% { transform: rotate(0deg) scale(1); }
  35%     { transform: rotate(1.4deg) scale(1.01); }
  70%     { transform: rotate(-0.9deg); }
}
@keyframes sw2 { 0%,100% { transform: rotate(-0.4deg); } 50% { transform: rotate(1.1deg); } }
@keyframes sw3 {
  0%,100% { transform: rotate(0.5deg) translateX(3px); }
  50%     { transform: rotate(-1.3deg) translateX(-3px); }
}

.cp-r1 { transform: scaleX(-1); }
.cp-r1.sw1 { animation-name: sw1r; }
@keyframes sw1r {
  0%,100% { transform: scaleX(-1) rotate(0deg); }
  35%     { transform: scaleX(-1) rotate(1.4deg); }
  70%     { transform: scaleX(-1) rotate(-0.9deg); }
}
.cp-r2 { transform: scaleX(-1); }
.cp-r2.sw1 { animation-name: sw1r; }

/* Gold decorative lines */
.gold-line {
  position: absolute; z-index: 2; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(200,164,90,0.15), transparent);
  height: 1px; width: 100%;
}
.gold-line-1 { top: 40%; }
.gold-line-2 { bottom: 40%; }

/* Content */
.cta-inner {
  position: relative; z-index: 3;
  display: flex; justify-content: center;
}
.cta-content {
  max-width: 660px; text-align: center;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.7s, transform 0.7s;
}
.cta-section.visible .cta-content {
  opacity: 1; transform: translateY(0);
}

.cta-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(200,164,90,0.3);
  background: rgba(200,164,90,0.07);
  color: #c8a45a;
  font-size: 11px; font-weight: 500;
  letter-spacing: 1.8px; text-transform: uppercase;
  padding: 7px 20px; border-radius: 100px;
  margin-bottom: 36px;
}
.cta-ep {
  width: 6px; height: 6px; border-radius: 50%;
  background: #c8a45a; flex-shrink: 0; position: relative;
}
.cta-ep::after {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  background: rgba(200,164,90,0.3);
  animation: ep 2s ease-in-out infinite;
}
@keyframes ep { 0%,100% { transform:scale(1);opacity:1; } 50% { transform:scale(2);opacity:0; } }

.cta-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(32px, 4.5vw, 58px);
  font-weight: 700; line-height: 1.15;
  color: rgba(224,242,232,0.9);
  letter-spacing: -0.5px; margin-bottom: 24px;
}
.cta-title em {
  font-style: italic;
  background: linear-gradient(135deg, #c8a45a 0%, #ead186 50%, #c8a45a 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-desc {
  font-size: 16px; color: rgba(255,255,255,0.45);
  line-height: 1.8; max-width: 480px;
  margin: 0 auto 40px; font-weight: 300;
}

.cta-actions {
  display: flex; align-items: center; flex-wrap: wrap;
  gap: 14px; justify-content: center;
  margin-bottom: 22px;
}

.cta-btn-primary {
  display: inline-flex; align-items: center; gap: 9px;
  background: white; color: #1b4332;
  font-size: 15px; font-weight: 700;
  padding: 14px 30px; border-radius: 14px;
  transition: all 0.25s;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}
.cta-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
}

.cta-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  color: rgba(255,255,255,0.7); font-size: 15px; font-weight: 500;
  padding: 12px 22px; border-radius: 14px;
  border: 1.5px solid rgba(255,255,255,0.18);
  transition: all 0.25s;
}
.cta-btn-ghost:hover {
  color: white; border-color: rgba(255,255,255,0.38);
  background: rgba(255,255,255,0.07);
}

.cta-reassurance {
  font-size: 12.5px; color: rgba(255,255,255,0.3);
}

@media (max-width: 640px) {
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-btn-primary, .cta-btn-ghost { justify-content: center; }
  .cp-l2, .cp-r2 { display: none; }
}
</style>
