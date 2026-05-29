<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollParallax, parallaxStyle } from '@/composables/useScrollParallax.js'

/* ── Hero mouse + scroll parallax ── */
const mx = ref(0), my = ref(0)
let tmx = 0, tmy = 0
const heroSy = ref(0)
let rafId

function onMove(e) {
  tmx = (e.clientX / window.innerWidth  - 0.5) * 2
  tmy = (e.clientY / window.innerHeight - 0.5) * 2
}
function tick() {
  mx.value += (tmx - mx.value) * 0.04
  my.value += (tmy - my.value) * 0.04
  rafId = requestAnimationFrame(tick)
}
function onHeroScroll() { heroSy.value = window.scrollY }

onMounted(() => {
  window.addEventListener('mousemove', onMove,      { passive: true })
  window.addEventListener('scroll',    onHeroScroll, { passive: true })
  rafId = requestAnimationFrame(tick)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('scroll',    onHeroScroll)
  cancelAnimationFrame(rafId)
})

const tFar  = computed(() => `translate3d(${mx.value*-22}px,${my.value*-14 + heroSy.value*0.13}px,0)`)
const tMid  = computed(() => `translate3d(${mx.value*-46}px,${my.value*-30 + heroSy.value*0.38}px,0)`)
const tNear = computed(() => `translate3d(${mx.value*-72}px,${my.value*-50 + heroSy.value*0.62}px,0)`)

/* ── Section parallax ── */
const buyRef  = ref(null)
const sellRef = ref(null)
const svcRef  = ref(null)
const advRef  = ref(null)
const ctaRef  = ref(null)
const sy = useScrollParallax()

const buyP1  = parallaxStyle(buyRef,  sy, 0.15)
const buyP2  = parallaxStyle(buyRef,  sy, 0.09)
const sellP1 = parallaxStyle(sellRef, sy, 0.13)
const sellP2 = parallaxStyle(sellRef, sy, 0.20)
const svcP1  = parallaxStyle(svcRef,  sy, 0.16)
const svcP2  = parallaxStyle(svcRef,  sy, 0.09)
const advP1  = parallaxStyle(advRef,  sy, 0.18)
const advP2  = parallaxStyle(advRef,  sy, 0.11)
const ctaP1  = parallaxStyle(ctaRef,  sy, 0.16)
const ctaP2  = parallaxStyle(ctaRef,  sy, 0.10)

/* ── Reveal on scroll ── */
const buyVisible  = ref(false)
const sellVisible = ref(false)
const svcVisible  = ref(false)
const advVisible  = ref(false)
const faqVisible  = ref(false)

onMounted(() => {
  function watch(el, cb) {
    if (!el) return
    new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { cb(true) } },
      { threshold: 0.10 }
    ).observe(el)
  }
  watch(buyRef.value,             v => buyVisible.value  = v)
  watch(sellRef.value,            v => sellVisible.value = v)
  watch(svcRef.value,             v => svcVisible.value  = v)
  watch(advRef.value,             v => advVisible.value  = v)
  watch(document.querySelector('.faq-section'), v => faqVisible.value = v)
})

/* ── FAQ ── */
const faqOpen = ref(null)
const faqs = [
  {
    q: "L'inscription est-elle gratuite ?",
    a: "Oui, entièrement. L'inscription, la publication d'annonces et la messagerie sont gratuites. L'Uni Vert ne prend aucune commission sur vos ventes."
  },
  {
    q: "Comment fonctionne la messagerie ?",
    a: "Notre messagerie intégrée vous permet de contacter directement les membres sans divulguer vos coordonnées. Vos échanges restent privés jusqu'à ce que vous choisissiez de partager vos informations."
  },
  {
    q: "Les échanges sont-ils sécurisés ?",
    a: "Chaque compte est vérifié à l'inscription. Nous recommandons d'effectuer les remises en main propre dans des lieux publics et de vérifier l'article avant tout paiement."
  },
  {
    q: "Puis-je vendre des espèces exotiques ou invasives ?",
    a: "La vente d'espèces végétales classées invasives par la réglementation française est strictement interdite. Pour les espèces exotiques légales, précisez clairement l'espèce et ses besoins culturaux dans votre annonce."
  },
  {
    q: "Comment signaler une annonce problématique ?",
    a: "Chaque annonce dispose d'un bouton « Signaler » visible en bas de page. Notre équipe modère les signalements sous 24h ouvrées et prend les mesures nécessaires."
  },
  {
    q: "Puis-je proposer des livraisons ?",
    a: "Absolument. Vous pouvez indiquer dans votre annonce si vous proposez la livraison, le retrait sur place ou les deux. La logistique de livraison est organisée directement entre les membres."
  },
]

const buySteps = [
  {
    n: '01', plant: '/Plant - Flat - 01.png',
    title: 'Explorez les annonces',
    desc: 'Recherchez par catégorie, ville ou mot-clé. Des milliers de plantes rares, graines sélectionnées, outils professionnels et services près de chez vous.',
  },
  {
    n: '02', plant: '/Plant - Flat - 04.png',
    title: 'Contactez le vendeur',
    desc: 'Envoyez un message directement via notre messagerie sécurisée. Posez vos questions, négociez le prix en toute confiance.',
  },
  {
    n: '03', plant: '/Plant - Flat - 07.png',
    title: 'Récupérez en main propre',
    desc: 'Convenez d\'un rendez-vous local. Vérifiez l\'article, payez et repartez avec votre nouvelle trouvaille botanique.',
  },
]

const sellSteps = [
  {
    n: '01', plant: '/Plant - Flat - 02.png',
    title: 'Publiez votre annonce',
    desc: 'Quelques photos, une description claire et un prix. Votre annonce est en ligne en moins de 2 minutes, visible par des milliers de jardiniers.',
  },
  {
    n: '02', plant: '/Plant - Flat - 05.png',
    title: 'Gérez vos demandes',
    desc: 'Recevez les messages des acheteurs intéressés, répondez depuis votre téléphone ou ordinateur et organisez les visites.',
  },
  {
    n: '03', plant: '/Plant - Flat - 08.png',
    title: 'Finalisez la vente',
    desc: 'Rencontrez l\'acheteur dans un lieu de confiance, remettez l\'article et concluez l\'échange. Simple, local, sans intermédiaire.',
  },
]

const svcSteps = [
  {
    n: '01', plant: '/Plant - Gradient - Outline - 02.png',
    title: 'Décrivez vos services',
    desc: 'Cours de jardinage, taille de haies, conception de potager, conseils en permaculture… Listez vos compétences et tarifs en toute liberté.',
  },
  {
    n: '02', plant: '/Plant - Gradient - Outline - 05.png',
    title: 'Trouvez vos clients',
    desc: 'Recevez des demandes de particuliers et professionnels de votre région. Gérez votre planning via la messagerie intégrée.',
  },
  {
    n: '03', plant: '/Plant - Gradient - Outline - 09.png',
    title: 'Développez votre réputation',
    desc: 'Chaque échange réussi renforce votre profil et attire de nouveaux clients. Construisez une vraie clientèle locale.',
  },
]

const advantages = [
  { icon: '🆓', title: 'Gratuit & sans commission', desc: 'Aucun frais caché, aucune commission sur vos ventes.' },
  { icon: '🌿', title: 'Communauté locale', desc: 'Des passionnés vérifiés à quelques kilomètres de chez vous.' },
  { icon: '🔒', title: 'Échanges sécurisés', desc: 'Messagerie privée, profils vérifiés, signalement facile.' },
  { icon: '⚡', title: 'Rapide & intuitif', desc: 'Une annonce publiée en 2 minutes depuis n\'importe quel appareil.' },
  { icon: '♻️', title: 'Éco-responsable', desc: 'Prolongez la vie de vos plantes et outils plutôt que de les jeter.' },
  { icon: '💬', title: 'Support réactif', desc: 'Notre équipe répond à chaque question dans les 24 heures.' },
]
</script>

<template>
  <main class="ccm-page">

    <!-- ─────────────── HERO ─────────────── -->
    <section class="ccm-hero">
      <div class="ccm-hero-bg"></div>
      <div class="ccm-hero-radial"></div>
      <div class="ccm-hero-vignette"></div>

      <!-- Parallax FAR -->
      <div class="pl" aria-hidden="true" :style="{ transform: tFar }">
        <div class="pw pwf1"><img src="/Plant - Gradient - Outline - 03.png" class="sw1" /></div>
        <div class="pw pwf2"><img src="/Plant - Gradient - Outline - 10.png" class="sw2" /></div>
      </div>
      <!-- Parallax MID -->
      <div class="pl" aria-hidden="true" :style="{ transform: tMid }">
        <div class="pw pwm1"><img src="/Plant - Flat - 04.png" class="sw3" /></div>
        <div class="pw pwm2"><img src="/Plant - Flat - 09.png" class="sw1" /></div>
      </div>
      <!-- Parallax NEAR -->
      <div class="pl" aria-hidden="true" :style="{ transform: tNear }">
        <div class="pw pwn1"><img src="/Plant - Flat - 11.png" class="sw2" /></div>
      </div>

      <div class="container ccm-hero-content">
        <div class="ccm-eyebrow">
          <span class="ccm-ep"></span>
          Guide de la plateforme
        </div>
        <h1 class="ccm-hero-title">
          Comment<br><em>ça marche ?</em>
        </h1>
        <p class="ccm-hero-sub">
          L'Uni Vert met en relation acheteurs, vendeurs et prestataires de jardinage.<br class="hide-sm">
          Découvrez comment profiter de la plateforme en quelques étapes.
        </p>
        <div class="ccm-hero-tabs">
          <a href="#acheter"   class="ccm-tab">Acheter</a>
          <a href="#vendre"    class="ccm-tab">Vendre</a>
          <a href="#services"  class="ccm-tab">Proposer des services</a>
        </div>
      </div>

      <div class="ccm-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,50 C240,80 480,10 720,50 C960,80 1200,10 1440,50 L1440,80 L0,80 Z" fill="#f7faf4"/>
        </svg>
      </div>
    </section>

    <!-- ─────────────── ACHETER ─────────────── -->
    <section class="steps-section steps-buy" id="acheter" ref="buyRef" :class="{ visible: buyVisible }">
      <div class="sp-deco" aria-hidden="true">
        <img src="/Plant - Flat - 06.png" class="spd spd-l" :style="buyP1" />
        <img src="/Plant - Flat - 10.png" class="spd spd-r" :style="buyP2" />
      </div>
      <div class="container">
        <div class="steps-header">
          <span class="steps-badge steps-badge--buy">Vous souhaitez acheter</span>
          <h2 class="steps-title">Trouvez la perle rare<br><em>près de chez vous</em></h2>
        </div>
        <div class="steps-grid">
          <div
            v-for="(step, i) in buySteps" :key="i"
            class="step-card"
            :style="{ '--i': i, '--accent': '#2d6a4f', '--light': '#f0fdf4' }"
          >
            <div class="step-num-bg">{{ step.n }}</div>
            <div class="step-plant-wrap">
              <img :src="step.plant" class="step-plant" />
            </div>
            <div class="step-num-pill">{{ step.n }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <div v-if="i < buySteps.length - 1" class="step-arrow">
              <svg viewBox="0 0 60 24" fill="none">
                <path d="M0 12 H47" stroke="#2d6a4f" stroke-width="1.5" stroke-dasharray="5 3"/>
                <path d="M40 5 L54 12 L40 19" stroke="#2d6a4f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="steps-cta">
          <RouterLink to="/annonces" class="steps-btn steps-btn--primary">
            Parcourir les annonces
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ─────────────── VENDRE ─────────────── -->
    <section class="steps-section steps-sell" id="vendre" ref="sellRef" :class="{ visible: sellVisible }">
      <div class="sp-deco" aria-hidden="true">
        <img src="/Plant - Gradient - Outline - 04.png" class="spd spd-l" :style="sellP1" />
        <img src="/Plant - Flat - 03.png"               class="spd spd-r" :style="sellP2" />
      </div>
      <div class="container">
        <div class="steps-header">
          <span class="steps-badge steps-badge--sell">Vous souhaitez vendre</span>
          <h2 class="steps-title">Donnez une seconde vie<br><em>à vos plantes & outils</em></h2>
        </div>
        <div class="steps-grid">
          <div
            v-for="(step, i) in sellSteps" :key="i"
            class="step-card"
            :style="{ '--i': i, '--accent': '#1e4a8a', '--light': '#eff6ff' }"
          >
            <div class="step-num-bg">{{ step.n }}</div>
            <div class="step-plant-wrap">
              <img :src="step.plant" class="step-plant" />
            </div>
            <div class="step-num-pill" style="background:#eff6ff;color:#1e4a8a">{{ step.n }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <div v-if="i < sellSteps.length - 1" class="step-arrow">
              <svg viewBox="0 0 60 24" fill="none">
                <path d="M0 12 H47" stroke="#1e4a8a" stroke-width="1.5" stroke-dasharray="5 3"/>
                <path d="M40 5 L54 12 L40 19" stroke="#1e4a8a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="steps-cta">
          <RouterLink to="/deposer" class="steps-btn steps-btn--sell">
            Déposer une annonce
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ─────────────── SERVICES ─────────────── -->
    <section class="steps-section steps-svc" id="services" ref="svcRef" :class="{ visible: svcVisible }">
      <div class="sp-deco" aria-hidden="true">
        <img src="/Plant - Gradient - Outline - 07.png" class="spd spd-l" :style="svcP1" />
        <img src="/Plant - Gradient - Outline - 11.png" class="spd spd-r" :style="svcP2" />
      </div>
      <div class="container">
        <div class="steps-header">
          <span class="steps-badge steps-badge--svc">Proposer des services</span>
          <h2 class="steps-title">Partagez votre expertise<br><em>avec la communauté</em></h2>
        </div>
        <div class="steps-grid">
          <div
            v-for="(step, i) in svcSteps" :key="i"
            class="step-card"
            :style="{ '--i': i, '--accent': '#713f12', '--light': '#fffbeb' }"
          >
            <div class="step-num-bg">{{ step.n }}</div>
            <div class="step-plant-wrap">
              <img :src="step.plant" class="step-plant" />
            </div>
            <div class="step-num-pill" style="background:#fffbeb;color:#713f12">{{ step.n }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <div v-if="i < svcSteps.length - 1" class="step-arrow">
              <svg viewBox="0 0 60 24" fill="none">
                <path d="M0 12 H47" stroke="#713f12" stroke-width="1.5" stroke-dasharray="5 3"/>
                <path d="M40 5 L54 12 L40 19" stroke="#713f12" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="steps-cta">
          <RouterLink to="/deposer" class="steps-btn steps-btn--svc">
            Proposer un service
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ─────────────── AVANTAGES ─────────────── -->
    <section class="adv-section" ref="advRef" :class="{ visible: advVisible }">
      <div class="adv-bg"></div>
      <div class="adv-radial"></div>
      <div class="adv-plants" aria-hidden="true">
        <img src="/Plant - Flat - 01.png" class="advp advp-l" :style="advP1" />
        <img src="/Plant - Flat - 08.png" class="advp advp-r" :style="advP2" />
      </div>
      <div class="container adv-inner">
        <div class="section-header">
          <span class="section-badge adv-badge">Pourquoi L'Uni Vert</span>
          <h2 class="section-title adv-title">La plateforme faite<br><em>pour les jardiniers</em></h2>
        </div>
        <div class="adv-grid">
          <div
            v-for="(adv, i) in advantages" :key="i"
            class="adv-card"
            :style="{ '--delay': `${i * 0.08}s` }"
          >
            <div class="adv-icon">{{ adv.icon }}</div>
            <h3 class="adv-title-card">{{ adv.title }}</h3>
            <p class="adv-desc">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────── FAQ ─────────────── -->
    <section class="faq-section">
      <div class="container faq-inner">
        <div class="section-header">
          <span class="section-badge">Questions fréquentes</span>
          <h2 class="section-title">Tout ce que vous<br>devez savoir</h2>
        </div>
        <div class="faq-list">
          <div
            v-for="(faq, i) in faqs" :key="i"
            class="faq-item"
            :class="{ open: faqOpen === i }"
          >
            <button class="faq-q" @click="faqOpen = faqOpen === i ? null : i">
              <span>{{ faq.q }}</span>
              <svg class="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div class="faq-a" v-show="faqOpen === i">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────── CTA ─────────────── -->
    <section class="ccm-cta" ref="ctaRef">
      <div class="ccm-cta-bg"></div>
      <div class="ccm-cta-radial"></div>
      <div class="ccm-cta-plants" aria-hidden="true">
        <div class="ctap ctap-l" :style="ctaP1"><img src="/Plant - Flat - 05.png" class="sw1" /></div>
        <div class="ctap ctap-r" :style="ctaP2"><img src="/Plant - Flat - 11.png" class="sw2 mirror" /></div>
        <div class="ctap ctap-accent-l" :style="ctaP1"><img src="/Plant - Gradient - Outline - 04.png" /></div>
      </div>
      <div class="container ccm-cta-inner">
        <div class="cta-eyebrow-pill">
          <span class="cta-ep"></span>
          Prêt à commencer ?
        </div>
        <h2 class="ccm-cta-title">
          Rejoignez une communauté<br>de <em>jardiniers passionnés</em>
        </h2>
        <p class="ccm-cta-desc">
          Plus de 4&nbsp;000 membres partagent déjà leurs plantes, graines et savoir-faire.
          Créez votre compte gratuitement en 30 secondes.
        </p>
        <div class="ccm-cta-btns">
          <RouterLink to="/inscription" class="cta-btn-w">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Créer mon compte gratuit
          </RouterLink>
          <RouterLink to="/annonces" class="cta-btn-ghost">
            Parcourir les annonces
          </RouterLink>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.ccm-page { overflow-x: hidden; }

/* ══════════════ HERO ══════════════ */
.ccm-hero {
  position: relative; min-height: 88vh;
  display: flex; align-items: center;
  overflow: hidden; padding: 120px 0 90px;
}
.ccm-hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(145deg, #1b4332 0%, #2d6a4f 45%, #40916c 90%, #52b788 100%);
  z-index: 0;
}
.ccm-hero-radial {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 40%, rgba(116,198,157,0.42) 0%, transparent 65%),
    radial-gradient(ellipse 40% 30% at 80% 70%, rgba(64,145,108,0.2) 0%, transparent 55%);
}
.ccm-hero-vignette {
  position: absolute; inset: 0; z-index: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(15,35,22,0.5) 100%);
}

/* Parallax layers */
.pl { position: absolute; inset: -25%; z-index: 1; pointer-events: none; will-change: transform; }
.pw { position: absolute; }
.pwf1 { top: -8%; right: -12%; width: min(52vw, 700px); }
.pwf2 { bottom: 2%; left: -8%;  width: min(40vw, 520px); }
.pwm1 { top: 6%;  right: 3%;   width: min(36vw, 440px); }
.pwm2 { bottom: 8%; left: 2%;  width: min(28vw, 360px); }
.pwn1 { top: 3%;  right: 18%;  width: min(18vw, 230px); }
.pl:nth-child(3) .sw1,
.pl:nth-child(3) .sw2 { opacity: 0.22; }
.pl:nth-child(4) .sw1,
.pl:nth-child(4) .sw3 { opacity: 0.42; }
.pl:nth-child(5) .sw2 { opacity: 0.58; }
.pl img { width: 100%; height: auto; display: block; user-select: none; -webkit-user-drag: none; }

/* Sway */
.sw1 { animation: sw1 10s ease-in-out infinite; transform-origin: bottom center; }
.sw2 { animation: sw2 13s ease-in-out infinite; transform-origin: bottom center; }
.sw3 { animation: sw3  8s ease-in-out infinite; transform-origin: bottom center; }
.mirror.sw1 { animation-name: sw1m; }
.mirror.sw2 { animation-name: sw2m; }
@keyframes sw1  { 0%,100% { transform: rotate(0deg); }   35% { transform: rotate(1.4deg); }  70% { transform: rotate(-0.9deg); } }
@keyframes sw2  { 0%,100% { transform: rotate(-0.4deg); } 50% { transform: rotate(1.1deg); } }
@keyframes sw3  { 0%,100% { transform: rotate(0.5deg) translateX(3px); } 50% { transform: rotate(-1.3deg) translateX(-3px); } }
@keyframes sw1m { 0%,100% { transform: scaleX(-1) rotate(0deg); }   35% { transform: scaleX(-1) rotate(1.4deg); }  70% { transform: scaleX(-1) rotate(-0.9deg); } }
@keyframes sw2m { 0%,100% { transform: scaleX(-1) rotate(-0.4deg); } 50% { transform: scaleX(-1) rotate(1.1deg); } }

/* Hero content */
.ccm-hero-content {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.ccm-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(82,183,136,0.35);
  background: rgba(82,183,136,0.1);
  color: #95d5b2; font-size: 11px; font-weight: 500;
  letter-spacing: 1.8px; text-transform: uppercase;
  padding: 7px 20px; border-radius: 100px; margin-bottom: 36px;
}
.ccm-ep {
  width: 7px; height: 7px; border-radius: 50%;
  background: #52b788; flex-shrink: 0; position: relative;
}
.ccm-ep::after {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  background: rgba(82,183,136,0.3);
  animation: ep 2s ease-in-out infinite;
}
@keyframes ep { 0%,100% { transform:scale(1);opacity:1; } 50% { transform:scale(2);opacity:0; } }

.ccm-hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(44px, 7.5vw, 100px);
  font-weight: 700; line-height: 1.05;
  color: rgba(255,255,255,0.95);
  letter-spacing: -2px; margin-bottom: 24px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.2);
}
.ccm-hero-title em {
  font-style: italic;
  background: linear-gradient(135deg, #c8a45a 0%, #ead186 50%, #c8a45a 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ccm-hero-sub {
  font-size: clamp(14px, 1.6vw, 17px); color: rgba(255,255,255,0.68);
  line-height: 1.85; max-width: 580px; margin-bottom: 44px; font-weight: 300;
}
.hide-sm { display: block; }
@media (max-width: 580px) { .hide-sm { display: none; } }

.ccm-hero-tabs {
  display: flex; align-items: center; flex-wrap: wrap; gap: 10px; justify-content: center;
}
.ccm-tab {
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.22);
  color: rgba(255,255,255,0.85);
  padding: 10px 22px; border-radius: 100px;
  font-size: 14px; font-weight: 500;
  transition: all 0.22s; text-decoration: none;
  backdrop-filter: blur(8px);
}
.ccm-tab:hover {
  background: rgba(255,255,255,0.2); color: white;
  border-color: rgba(255,255,255,0.4);
  transform: translateY(-2px);
}

.ccm-wave {
  position: absolute; bottom: -2px; left: 0; right: 0; z-index: 4; line-height: 0;
}
.ccm-wave svg { width: 100%; height: 80px; }

/* ══════════════ STEP SECTIONS ══════════════ */
.steps-section {
  padding: 96px 0 80px;
  position: relative; overflow: hidden;
}
.steps-buy  { background: #f7faf4; }
.steps-sell { background: white; }
.steps-svc  { background: #f7faf4; }

/* Background plant deco */
.sp-deco { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.spd { position: absolute; height: auto; will-change: transform; user-select: none; -webkit-user-drag: none; }
.spd-l { width: min(28vw, 340px); bottom: -30px; left: -60px; opacity: 0.10; rotate: -20deg; }
.spd-r { width: min(24vw, 300px); top: -20px;  right: -50px; opacity: 0.09; scale: -1 1; rotate: -15deg; }

.container { position: relative; z-index: 1; }

/* Step header */
.steps-header { text-align: center; margin-bottom: 60px; }
.steps-badge {
  display: inline-flex; align-items: center;
  font-size: 11.5px; font-weight: 600;
  padding: 5px 16px; border-radius: 100px;
  letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;
}
.steps-badge--buy  { background: #f0fdf4; border: 1.5px solid #b7e4c7; color: #2d6a4f; }
.steps-badge--sell { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e4a8a; }
.steps-badge--svc  { background: #fffbeb; border: 1.5px solid #fde68a; color: #713f12; }

.steps-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 4vw, 46px); font-weight: 700;
  color: #0f2b1b; letter-spacing: -0.5px; line-height: 1.15;
}
.steps-title em {
  font-style: italic;
  background: linear-gradient(135deg, #52b788, #2d6a4f);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* Steps grid */
.steps-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 28px; margin-bottom: 52px;
}

.step-card {
  background: white; border-radius: 22px;
  border: 1.5px solid #e8f5ec;
  padding: 32px 24px 28px;
  position: relative; overflow: hidden;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  opacity: 0; transform: translateY(32px);
  transition:
    opacity 0.6s calc(var(--i) * 0.14s),
    transform 0.6s calc(var(--i) * 0.14s),
    box-shadow 0.3s,
    border-color 0.3s;
}
.steps-section.visible .step-card {
  opacity: 1; transform: translateY(0);
}
.step-card:hover {
  box-shadow: 0 20px 48px rgba(0,0,0,0.1);
  border-color: var(--accent, #2d6a4f);
  transform: translateY(-6px);
}
.step-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--accent, #2d6a4f);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s;
}
.step-card:hover::before { transform: scaleX(1); }

.step-num-bg {
  position: absolute; top: 10px; right: 14px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 70px; font-weight: 700; font-style: italic;
  color: var(--accent, #2d6a4f); opacity: 0.06;
  line-height: 1; pointer-events: none; user-select: none;
}

.step-plant-wrap { width: 88px; height: 88px; display: flex; align-items: center; justify-content: center; }
.step-plant {
  width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(0 6px 14px rgba(0,0,0,0.12));
  transition: transform 0.4s;
}
.step-card:hover .step-plant { transform: scale(1.08) translateY(-4px); }

.step-num-pill {
  background: var(--light, #f0fdf4);
  color: var(--accent, #2d6a4f);
  font-size: 11px; font-weight: 700;
  letter-spacing: 1px; padding: 4px 12px;
  border-radius: 100px;
}
.step-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 19px; font-weight: 700; color: #0f2b1b;
}
.step-desc { font-size: 14px; color: #6b7280; line-height: 1.7; max-width: 280px; }

.step-arrow {
  position: absolute; right: -40px; top: 50%;
  transform: translateY(-50%); width: 60px; z-index: 5;
}
.step-arrow svg { width: 100%; }

.steps-cta { text-align: center; }
.steps-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 600; padding: 13px 28px; border-radius: 14px;
  transition: all 0.25s;
}
.steps-btn--primary { background: #2d6a4f; color: white; }
.steps-btn--primary:hover { background: #1b4332; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(27,67,50,0.25); }
.steps-btn--sell { background: #1e4a8a; color: white; }
.steps-btn--sell:hover { background: #163a6e; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(30,74,138,0.25); }
.steps-btn--svc { background: #713f12; color: white; }
.steps-btn--svc:hover { background: #5a3009; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(113,63,18,0.25); }

/* ══════════════ AVANTAGES ══════════════ */
.adv-section {
  position: relative; padding: 96px 0; overflow: hidden;
}
.adv-bg {
  position: absolute; inset: 0;
  background: linear-gradient(145deg, #1b4332 0%, #2d6a4f 50%, #3a8c65 100%);
  z-index: 0;
}
.adv-radial {
  position: absolute; inset: 0; z-index: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(116,198,157,0.35) 0%, transparent 65%);
}
.adv-plants { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.advp { position: absolute; height: auto; will-change: transform; user-select: none; }
.advp-l { width: min(26vw, 320px); bottom: -20px; left: -50px; opacity: 0.25; filter: brightness(0.8); rotate: -15deg; }
.advp-r { width: min(22vw, 280px); top: -20px; right: -40px; opacity: 0.22; filter: brightness(0.8); scale: -1 1; rotate: -12deg; }

.adv-inner { position: relative; z-index: 2; }
.adv-badge { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22); color: rgba(255,255,255,0.85); }
.adv-title { color: white !important; }
.adv-title em {
  font-style: italic;
  background: linear-gradient(135deg, #c8a45a, #ead186);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.section-header .adv-title { color: white !important; }

.adv-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
}
.adv-card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px; padding: 28px 24px;
  backdrop-filter: blur(8px);
  transition: all 0.3s;
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.5s var(--delay), transform 0.5s var(--delay), background 0.25s, border-color 0.25s;
}
.adv-section.visible .adv-card { opacity: 1; transform: translateY(0); }
.adv-card:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.28); transform: translateY(-4px); }

.adv-icon { font-size: 28px; margin-bottom: 12px; }
.adv-title-card { font-size: 16px; font-weight: 700; color: white; margin-bottom: 8px; }
.adv-desc { font-size: 13.5px; color: rgba(255,255,255,0.58); line-height: 1.7; }

/* ══════════════ FAQ ══════════════ */
.faq-section { padding: 96px 0; background: #f7faf4; }
.faq-inner { max-width: 780px; }
.faq-list { display: flex; flex-direction: column; gap: 10px; }

.faq-item {
  background: white; border: 1.5px solid #e8f5ec;
  border-radius: 16px; overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.faq-item.open {
  border-color: #74c69d;
  box-shadow: 0 4px 20px rgba(82,183,136,0.12);
}
.faq-q {
  width: 100%; background: none; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 20px 22px; text-align: left; font-family: inherit;
  font-size: 15px; font-weight: 600; color: #1f2937;
  transition: color 0.2s;
}
.faq-item.open .faq-q { color: #2d6a4f; }
.faq-chevron { flex-shrink: 0; color: #9ca3af; transition: transform 0.3s, color 0.2s; }
.faq-item.open .faq-chevron { transform: rotate(180deg); color: #2d6a4f; }
.faq-a { padding: 0 22px 20px; }
.faq-a p { font-size: 14.5px; color: #6b7280; line-height: 1.75; }

/* ══════════════ CTA ══════════════ */
.ccm-cta { position: relative; padding: 120px 0; overflow: hidden; }
.ccm-cta-bg {
  position: absolute; inset: 0;
  background: linear-gradient(145deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%);
  z-index: 0;
}
.ccm-cta-radial {
  position: absolute; inset: 0; z-index: 0;
  background: radial-gradient(ellipse 70% 55% at 50% 45%, rgba(116,198,157,0.4) 0%, transparent 65%);
}
.ccm-cta-plants { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.ctap { position: absolute; }
.ctap-l { bottom: -20px; left: -30px;  width: min(28vw, 340px); opacity: 0.55; }
.ctap-r { bottom: -10px; right: -20px; width: min(24vw, 300px); opacity: 0.50; }
.ctap-accent-l { top: -20px; left: -40px; width: min(20vw, 260px); opacity: 0.14; }
.ctap img { width: 100%; height: auto; display: block; }

.ccm-cta-inner { position: relative; z-index: 3; text-align: center; max-width: 620px; margin: 0 auto; }
.cta-eyebrow-pill {
  display: inline-flex; align-items: center; gap: 10px;
  border: 1px solid rgba(200,164,90,0.35);
  background: rgba(200,164,90,0.09);
  color: #c8a45a; font-size: 11px; font-weight: 500;
  letter-spacing: 1.8px; text-transform: uppercase;
  padding: 7px 20px; border-radius: 100px; margin-bottom: 32px;
}
.cta-ep { width: 6px; height: 6px; border-radius: 50%; background: #c8a45a; position: relative; }
.cta-ep::after {
  content: ''; position: absolute; inset: -4px; border-radius: 50%;
  background: rgba(200,164,90,0.3); animation: ep 2s ease-in-out infinite;
}
.ccm-cta-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 4vw, 52px); font-weight: 700;
  color: rgba(255,255,255,0.95); letter-spacing: -0.5px;
  line-height: 1.15; margin-bottom: 20px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.ccm-cta-title em {
  font-style: italic;
  background: linear-gradient(135deg, #c8a45a, #ead186);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ccm-cta-desc {
  font-size: 16px; color: rgba(255,255,255,0.6);
  line-height: 1.8; max-width: 440px; margin: 0 auto 36px; font-weight: 300;
}
.ccm-cta-btns { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; justify-content: center; }
.cta-btn-w {
  display: inline-flex; align-items: center; gap: 9px;
  background: white; color: #1b4332;
  font-size: 15px; font-weight: 700;
  padding: 14px 28px; border-radius: 14px;
  transition: all 0.25s; box-shadow: 0 4px 24px rgba(0,0,0,0.2);
}
.cta-btn-w:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(0,0,0,0.28); }
.cta-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  color: rgba(255,255,255,0.75); font-size: 15px; font-weight: 500;
  padding: 12px 22px; border-radius: 14px;
  border: 1.5px solid rgba(255,255,255,0.22); transition: all 0.25s;
}
.cta-btn-ghost:hover { color: white; border-color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.08); }

/* ══════════════ RESPONSIVE ══════════════ */
@media (max-width: 900px) {
  .steps-grid { grid-template-columns: 1fr; gap: 20px; }
  .step-arrow { display: none; }
  .adv-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 580px) {
  .ccm-hero { min-height: auto; padding: 100px 0 100px; }
  .adv-grid { grid-template-columns: 1fr; }
  .ccm-cta-btns { flex-direction: column; align-items: stretch; }
  .cta-btn-w, .cta-btn-ghost { justify-content: center; }
}
</style>
