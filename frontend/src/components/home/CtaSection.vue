<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollParallax, parallaxStyle } from '@/composables/useScrollParallax.js'

const visible    = ref(false)
const sectionRef = ref(null)
const sy         = useScrollParallax()

const p1 = parallaxStyle(sectionRef, sy, 0.16)
const p2 = parallaxStyle(sectionRef, sy, 0.09)
const p3 = parallaxStyle(sectionRef, sy, 0.20)
const p4 = parallaxStyle(sectionRef, sy, 0.12)
const pa1 = parallaxStyle(sectionRef, sy, 0.06)
const pa2 = parallaxStyle(sectionRef, sy, 0.07)

onMounted(() => {
  const obs = new IntersectionObserver(
    e => { if (e[0].isIntersecting) visible.value = true },
    { threshold: 0.15 }
  )
  if (sectionRef.value) obs.observe(sectionRef.value)
})
</script>

<template>
  <section class="cta-section" ref="sectionRef" :class="{ visible }">
    <div class="cta-bg"></div>
    <div class="cta-radial"></div>

    <!-- Flat plant silhouettes -->
    <div class="cta-plants" aria-hidden="true">
      <div class="cpw cpw-l1" :style="p1">
        <img src="/Plant - Flat - 02.png" class="sw1" />
      </div>
      <div class="cpw cpw-l2" :style="p2">
        <img src="/Plant - Flat - 08.png" class="sw3" />
      </div>
      <div class="cpw cpw-r1" :style="p3">
        <img src="/Plant - Flat - 05.png" class="sw2 mirror" />
      </div>
      <div class="cpw cpw-r2" :style="p4">
        <img src="/Plant - Flat - 10.png" class="sw1 mirror" />
      </div>
    </div>

    <!-- Gradient-outline accent plants -->
    <div class="cta-accents" aria-hidden="true">
      <div class="caw caw-l" :style="pa1">
        <img src="/Plant - Gradient - Outline - 04.png" />
      </div>
      <div class="caw caw-r" :style="pa2">
        <img src="/Plant - Gradient - Outline - 11.png" />
      </div>
    </div>

    <!-- Gold lines -->
    <div class="gold-line gold-l1"></div>
    <div class="gold-line gold-l2"></div>

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

/* ── FOND VERT FORÊT (comme le héro) ── */
.cta-bg {
  position: absolute; inset: 0;
  background: linear-gradient(145deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%);
  z-index: 0;
}
.cta-radial {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 40%, rgba(116,198,157,0.42) 0%, transparent 65%),
    radial-gradient(ellipse 45% 35% at 15% 80%, rgba(82,183,136,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 40% 30% at 85% 70%, rgba(64,145,108,0.18) 0%, transparent 50%);
}

/* ── PLANTS ── */
.cta-plants, .cta-accents { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

/* Flat plant wrappers */
.cpw { position: absolute; }
.cpw-l1 { bottom: -20px; left: -30px;  width: min(30vw, 380px); opacity: 0.62; }
.cpw-l2 { bottom: 10%;   left: 13%;    width: min(19vw, 240px); opacity: 0.40; }
.cpw-r1 { bottom: -20px; right: -20px; width: min(28vw, 360px); opacity: 0.62; }
.cpw-r2 { bottom: 12%;   right: 14%;   width: min(17vw, 210px); opacity: 0.40; }

.cpw img { width: 100%; height: auto; display: block; user-select: none; -webkit-user-drag: none; }

/* Gradient-outline accent wrappers */
.caw { position: absolute; }
.caw-l { top: -30px; left: -50px;  width: min(24vw, 300px); opacity: 0.18; }
.caw-r { top: -20px; right: -40px; width: min(22vw, 280px); opacity: 0.16; transform: scaleX(-1); }
.caw img { width: 100%; height: auto; display: block; }

/* Sway animations */
.sw1 { animation: sw1 10s ease-in-out infinite; transform-origin: bottom center; }
.sw2 { animation: sw2 13s ease-in-out infinite; transform-origin: bottom center; }
.sw3 { animation: sw3  8s ease-in-out infinite; transform-origin: bottom center; }
.mirror.sw1 { animation-name: sw1m; }
.mirror.sw2 { animation-name: sw2m; }
.mirror.sw3 { animation-name: sw3m; }

@keyframes sw1  { 0%,100% { transform: rotate(0deg); }  35% { transform: rotate(1.4deg); }  70% { transform: rotate(-0.9deg); } }
@keyframes sw2  { 0%,100% { transform: rotate(-0.4deg); } 50% { transform: rotate(1.1deg); } }
@keyframes sw3  { 0%,100% { transform: rotate(0.5deg) translateX(3px); } 50% { transform: rotate(-1.3deg) translateX(-3px); } }
@keyframes sw1m { 0%,100% { transform: scaleX(-1) rotate(0deg); }  35% { transform: scaleX(-1) rotate(1.4deg); }  70% { transform: scaleX(-1) rotate(-0.9deg); } }
@keyframes sw2m { 0%,100% { transform: scaleX(-1) rotate(-0.4deg); } 50% { transform: scaleX(-1) rotate(1.1deg); } }
@keyframes sw3m { 0%,100% { transform: scaleX(-1) rotate(0.5deg); } 50% { transform: scaleX(-1) rotate(-1.3deg); } }

/* Gold lines */
.gold-line { position: absolute; z-index: 2; pointer-events: none; width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(200,164,90,0.18), transparent); }
.gold-l1 { top: 38%; }
.gold-l2 { bottom: 35%; }

/* ── CONTENT ── */
.cta-inner { position: relative; z-index: 3; display: flex; justify-content: center; }
.cta-content {
  max-width: 660px; text-align: center;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.7s, transform 0.7s;
}
.cta-section.visible .cta-content { opacity: 1; transform: translateY(0); }

.cta-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(200,164,90,0.35);
  background: rgba(200,164,90,0.09);
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
  color: rgba(255,255,255,0.95);
  letter-spacing: -0.5px; margin-bottom: 24px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.cta-title em {
  font-style: italic;
  background: linear-gradient(135deg, #c8a45a 0%, #ead186 50%, #c8a45a 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-desc {
  font-size: 16px; color: rgba(255,255,255,0.65);
  line-height: 1.8; max-width: 480px;
  margin: 0 auto 40px; font-weight: 300;
}

.cta-actions {
  display: flex; align-items: center; flex-wrap: wrap;
  gap: 14px; justify-content: center; margin-bottom: 22px;
}
.cta-btn-primary {
  display: inline-flex; align-items: center; gap: 9px;
  background: white; color: #1b4332;
  font-size: 15px; font-weight: 700;
  padding: 14px 30px; border-radius: 14px;
  transition: all 0.25s;
  box-shadow: 0 4px 24px rgba(0,0,0,0.22);
}
.cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.cta-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  color: rgba(255,255,255,0.78); font-size: 15px; font-weight: 500;
  padding: 12px 22px; border-radius: 14px;
  border: 1.5px solid rgba(255,255,255,0.25);
  transition: all 0.25s;
}
.cta-btn-ghost:hover { color: white; border-color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.09); }
.cta-reassurance { font-size: 12.5px; color: rgba(255,255,255,0.35); }

@media (max-width: 640px) {
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-btn-primary, .cta-btn-ghost { justify-content: center; }
  .cpw-l2, .cpw-r2 { display: none; }
}
</style>
