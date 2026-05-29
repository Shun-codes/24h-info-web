<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery    = ref('')
const searchLocation = ref('')
const quickTags = ['Monstera', 'Graines', 'Outils', 'Cours', 'Services']

const mx = ref(0), my = ref(0)
let tmx = 0, tmy = 0
const sy = ref(0)
let rafId

function onMouseMove(e) {
  tmx = (e.clientX / window.innerWidth  - 0.5) * 2
  tmy = (e.clientY / window.innerHeight - 0.5) * 2
}
function tick() {
  mx.value += (tmx - mx.value) * 0.038
  my.value += (tmy - my.value) * 0.038
  rafId = requestAnimationFrame(tick)
}
function onScroll() { sy.value = window.scrollY }

function search() {
  const q = {}
  if (searchQuery.value.trim())    q.search = searchQuery.value.trim()
  if (searchLocation.value.trim()) q.city   = searchLocation.value.trim()
  router.push({ path: '/annonces', query: q })
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('scroll',    onScroll,    { passive: true })
  rafId = requestAnimationFrame(tick)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('scroll',    onScroll)
  cancelAnimationFrame(rafId)
})

const tFar  = computed(() => `translate3d(${mx.value*-30}px,${my.value*-20 + sy.value*0.14}px,0)`)
const tMid  = computed(() => `translate3d(${mx.value*-62}px,${my.value*-42 + sy.value*0.42}px,0)`)
const tNear = computed(() => `translate3d(${mx.value*-100}px,${my.value*-68 + sy.value*0.72}px,0)`)
const tTxt  = computed(() => `translate3d(${mx.value*-8}px,${sy.value*0.18}px,0)`)
</script>

<template>
  <section class="hero">
    <div class="bg-base"></div>
    <div class="bg-radial"></div>
    <div class="bg-vignette"></div>

    <!-- ── FAR LAYER ── -->
    <div class="pl" aria-hidden="true" :style="{ transform: tFar }">
      <div class="pw pw-f1"><img src="/Plant - Gradient - Outline - 03.png" class="plant sw1" /></div>
      <div class="pw pw-f2"><img src="/Plant - Gradient - Outline - 10.png" class="plant sw2" /></div>
      <div class="pw pw-f3"><img src="/Plant - Gradient - Outline - 07.png" class="plant sw3" /></div>
    </div>

    <!-- ── MID LAYER ── -->
    <div class="pl" aria-hidden="true" :style="{ transform: tMid }">
      <div class="pw pw-m1"><img src="/Plant - Flat - 04.png" class="plant sw2" /></div>
      <div class="pw pw-m2"><img src="/Plant - Flat - 09.png" class="plant sw1" /></div>
    </div>

    <!-- ── NEAR LAYER ── -->
    <div class="pl" aria-hidden="true" :style="{ transform: tNear }">
      <div class="pw pw-n1"><img src="/Plant - Outline - 05.png" class="plant sw3" /></div>
      <div class="pw pw-n2"><img src="/Plant - Outline - 02.png" class="plant sw1" /></div>
    </div>

    <!-- Bottom plant row -->
    <div class="bp-row" aria-hidden="true">
      <img src="/Plant - Flat - 01.png"  class="bp sw2" style="--d:0s;--h:18vh"   />
      <img src="/Plant - Flat - 06.png"  class="bp sw1" style="--d:-2.1s;--h:23vh" />
      <img src="/Plant - Flat - 11.png"  class="bp sw3" style="--d:-4s;--h:26vh"   />
      <img src="/Plant - Flat - 03.png"  class="bp sw2" style="--d:-1.3s;--h:21vh" />
      <img src="/Plant - Flat - 07.png"  class="bp sw1" style="--d:-3.5s;--h:19vh" />
    </div>

    <!-- Horizontal rule decorative -->
    <div class="h-rule h-rule-l"></div>
    <div class="h-rule h-rule-r"></div>

    <!-- ── CONTENT ── -->
    <div class="hero-content container" :style="{ transform: tTxt }">

      <div class="eyebrow">
        <span class="ep"></span>
        Marketplace du jardinage · France
      </div>

      <h1 class="hero-title">
        <span class="tl tl-a">Partagez votre</span>
        <span class="tl tl-b"><em>passion verte</em></span>
        <span class="tl tl-c">avec le monde</span>
      </h1>

      <p class="hero-sub">
        Achetez, vendez et échangez plantes, graines,<br class="br-hide">
        outils et savoirs avec des passionnés près de chez vous.
      </p>

      <div class="search-glass">
        <div class="sf sf-main">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            @keyup.enter="search"
            type="text" class="si"
            placeholder="Monstera, sécateur, cours de taille…"
          />
        </div>
        <div class="sdiv"></div>
        <div class="sf sf-loc">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <input
            v-model="searchLocation"
            @keyup.enter="search"
            type="text" class="si"
            placeholder="Ville, région…"
          />
        </div>
        <button class="sbtn" @click="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Rechercher
        </button>
      </div>

      <div class="qtags">
        <span class="ql">Tendance :</span>
        <RouterLink
          v-for="t in quickTags" :key="t"
          :to="`/annonces?search=${t}`"
          class="qt"
        >{{ t }}</RouterLink>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="scroll-hint" aria-hidden="true">
      <div class="sh-line"></div>
      <span>scroll</span>
    </div>

    <!-- Wave -->
    <div class="hero-wave">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,50 C240,80 480,10 720,50 C960,80 1200,10 1440,50 L1440,80 L0,80 Z" fill="#f7faf4"/>
      </svg>
    </div>
  </section>
</template>

<style scoped>
/* ── FOUNDATION ── */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 120px 0 100px;
}

.bg-base {
  position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(145deg, #1b4332 0%, #2d6a4f 45%, #40916c 85%, #52b788 100%);
}
.bg-radial {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 35%, rgba(116,198,157,0.45) 0%, transparent 65%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(82,183,136,0.25) 0%, transparent 60%),
    radial-gradient(ellipse 40% 35% at 80% 70%, rgba(64,145,108,0.2) 0%, transparent 55%);
}
.bg-vignette {
  position: absolute; inset: 0; z-index: 0;
  background: radial-gradient(ellipse at center,
    transparent 30%, rgba(15,35,22,0.55) 100%);
}

/* ── PARALLAX LAYERS ── */
.pl {
  position: absolute; inset: -25%;
  z-index: 1; pointer-events: none;
  will-change: transform;
}
.pw { position: absolute; }

/* FAR */
.pw-f1 { top: -6%;  right: -10%; width: min(55vw, 760px); }
.pw-f2 { bottom:  3%; left:  -6%; width: min(42vw, 560px); }
.pw-f3 { top: 28%;   left:  20%; width: min(26vw, 360px); }

/* MID */
.pw-m1 { top:  6%; right:  4%;  width: min(38vw, 480px); }
.pw-m2 { bottom: 6%; left: 2%;  width: min(30vw, 400px); }

/* NEAR */
.pw-n1 { top:  4%; right: 17%; width: min(20vw, 260px); }
.pw-n2 { bottom: 16%; left: 12%; width: min(17vw, 210px); }

.plant {
  width: 100%; height: auto; display: block;
  user-select: none; -webkit-user-drag: none;
}

/* Layer opacities — much more visible on the lighter green bg */
.pl:nth-child(3) .plant { opacity: 0.50; }
.pl:nth-child(4) .plant { opacity: 0.78; }
.pl:nth-child(5) .plant { opacity: 0.95; }

/* Sway animations */
.sw1 { animation: sw1 10s ease-in-out infinite; transform-origin: bottom center; }
.sw2 { animation: sw2 13s ease-in-out infinite; transform-origin: bottom center; }
.sw3 { animation: sw3  8s ease-in-out infinite; transform-origin: bottom center; }

@keyframes sw1 {
  0%,100% { transform: rotate(0deg) scale(1); }
  35%     { transform: rotate(1.4deg) scale(1.01); }
  70%     { transform: rotate(-0.9deg) scale(0.99); }
}
@keyframes sw2 {
  0%,100% { transform: rotate(-0.4deg); }
  50%     { transform: rotate(1.1deg); }
}
@keyframes sw3 {
  0%,100% { transform: rotate(0.5deg) translateX(3px); }
  50%     { transform: rotate(-1.3deg) translateX(-3px); }
}

/* ── BOTTOM PLANT ROW ── */
.bp-row {
  position: absolute;
  bottom: 46px; left: 0; right: 0;
  z-index: 2; pointer-events: none;
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 0 3%;
}
.bp {
  height: min(var(--h, 20vh), 180px);
  width: auto; display: block;
  opacity: 0.80; filter: brightness(1.05) saturate(1.1);
  animation-delay: var(--d, 0s);
  user-select: none; -webkit-user-drag: none;
  filter: drop-shadow(0 -8px 20px rgba(0,0,0,0.15));
}

/* Decorative lines */
.h-rule {
  position: absolute; top: 0; bottom: 0; z-index: 2;
  width: 1px;
  background: linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.18) 65%, transparent 90%);
}
.h-rule-l { left: calc(50% - 380px); }
.h-rule-r { right: calc(50% - 380px); }

/* ── CONTENT ── */
.hero-content {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  will-change: transform;
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(82,183,136,0.28);
  background: rgba(82,183,136,0.07);
  backdrop-filter: blur(10px);
  color: #95d5b2;
  font-size: 11px; font-weight: 500;
  letter-spacing: 1.8px; text-transform: uppercase;
  padding: 7px 20px; border-radius: 100px;
  margin-bottom: 40px;
}
.ep {
  width: 7px; height: 7px; border-radius: 50%;
  background: #52b788; flex-shrink: 0; position: relative;
}
.ep::after {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  background: rgba(82,183,136,0.3);
  animation: ep 2s ease-in-out infinite;
}
@keyframes ep { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(2); opacity:0; } }

/* Title */
.hero-title {
  display: flex; flex-direction: column;
  margin-bottom: 28px;
}
.tl { display: block; }
.tl-a {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(30px, 5vw, 68px);
  font-weight: 400;
  color: rgba(255,255,255,0.95);
  letter-spacing: -1px; line-height: 1.1;
  text-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
.tl-b {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(46px, 7.8vw, 104px);
  font-weight: 700; font-style: italic;
  letter-spacing: -2px; line-height: 1.0;
  margin: 2px 0 6px;
}
.tl-b em {
  font-style: italic;
  background: linear-gradient(135deg, #c8a45a 0%, #ead186 45%, #c8a45a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.tl-c {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(30px, 5vw, 68px);
  font-weight: 400;
  color: rgba(255,255,255,0.95);
  letter-spacing: -1px; line-height: 1.1;
  text-shadow: 0 2px 12px rgba(0,0,0,0.2);
}

.hero-sub {
  font-size: clamp(14px, 1.7vw, 17px);
  color: rgba(255,255,255,0.75);
  line-height: 1.85; max-width: 500px;
  margin-bottom: 48px; font-weight: 400;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.br-hide { display: block; }
@media (max-width: 580px) { .br-hide { display: none; } }

/* ── SEARCH ── */
.search-glass {
  display: flex; align-items: center;
  width: 100%; max-width: 700px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.5);
  border-radius: 18px;
  padding: 5px 5px 5px 0;
  box-shadow:
    0 12px 48px rgba(0,0,0,0.25),
    0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.search-glass:focus-within {
  border-color: rgba(82,183,136,0.6);
  box-shadow:
    0 16px 56px rgba(0,0,0,0.3),
    0 0 0 3px rgba(82,183,136,0.2);
}
.sf {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 16px; flex: 1;
  color: #9ca3af;
}
.sf-main { flex: 2; }
.sf-loc  { flex: 1; }
.si {
  border: none; outline: none;
  background: transparent;
  color: #1f2937;
  font-size: 14px; font-family: inherit; width: 100%;
}
.si::placeholder { color: #9ca3af; }
.sdiv {
  width: 1px; height: 26px;
  background: #e5e7eb; flex-shrink: 0;
}
.sbtn {
  display: flex; align-items: center; gap: 8px;
  background: #40916c; color: white;
  border: none; cursor: pointer; font-family: inherit;
  padding: 12px 22px; border-radius: 14px;
  font-size: 14px; font-weight: 600;
  white-space: nowrap; flex-shrink: 0;
  transition: all 0.22s;
}
.sbtn:hover {
  background: #2d6a4f; transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(64,145,108,0.45);
}

/* Quick tags */
.qtags {
  display: flex; align-items: center;
  flex-wrap: wrap; gap: 8px; justify-content: center;
}
.ql { font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 500; }
.qt {
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.35);
  color: rgba(255,255,255,0.9);
  padding: 5px 14px; border-radius: 100px;
  font-size: 12.5px; font-weight: 500;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}
.qt:hover {
  background: rgba(255,255,255,0.3);
  border-color: rgba(255,255,255,0.55);
  color: white;
}

/* ── SCROLL HINT ── */
.scroll-hint {
  position: absolute; bottom: 94px; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  z-index: 10; opacity: 0;
  animation: fadein 1s 2s forwards;
}
@keyframes fadein { to { opacity: 0.4; } }
.sh-line {
  width: 1px; height: 50px;
  background: linear-gradient(to bottom, transparent, rgba(82,183,136,0.9));
  animation: shline 2.2s ease-in-out infinite;
}
@keyframes shline {
  0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
  45%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
  55%  { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
  100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
}
.scroll-hint span {
  font-size: 9px; letter-spacing: 2.5px;
  text-transform: uppercase; color: rgba(255,255,255,0.5);
}

/* ── WAVE ── */
.hero-wave {
  position: absolute; bottom: -2px; left: 0; right: 0;
  z-index: 4; line-height: 0;
}
.hero-wave svg { width: 100%; height: 80px; }

/* ── MOBILE ── */
@media (max-width: 768px) {
  .hero { min-height: auto; padding: 100px 0 110px; }
  .pw-f3, .pw-n1, .pw-n2 { display: none; }
  .h-rule { display: none; }
  .search-glass {
    flex-direction: column; align-items: stretch;
    padding: 8px; gap: 2px; border-radius: 16px;
  }
  .sdiv { display: none; }
  .sf { padding: 10px 12px; }
  .sbtn { border-radius: 12px; justify-content: center; }
  .bp { height: min(12vh, 90px); }
}
</style>
