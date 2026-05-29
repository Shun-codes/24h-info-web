<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery    = ref('')
const searchLocation = ref('')

const quickTags = ['Monstera', 'Graines', 'Outils', 'Cours', 'Services']

function search() {
  const q = {}
  if (searchQuery.value.trim())    q.search = searchQuery.value.trim()
  if (searchLocation.value.trim()) q.city   = searchLocation.value.trim()
  router.push({ path: '/annonces', query: q })
}
</script>

<template>
  <section class="hero">
    <!-- Background blobs -->
    <div class="bg-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Floating particles -->
    <div class="particles" aria-hidden="true">
      <div v-for="i in 18" :key="i" class="particle" :style="`--i:${i};--tx:${(i%3===0?1:-1)*(10+i*4)}px`"></div>
    </div>

    <!-- Decorative leaves -->
    <svg class="deco-leaf deco-leaf--tr" viewBox="0 0 300 400" fill="none" aria-hidden="true">
      <path d="M150 20C220 20 270 80 270 160C270 260 200 340 150 380C100 340 30 260 30 160C30 80 80 20 150 20Z" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" fill="rgba(255,255,255,0.03)"/>
      <path d="M150 20C150 20 230 100 230 160" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <path d="M150 380V160" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </svg>
    <svg class="deco-leaf deco-leaf--bl" viewBox="0 0 200 260" fill="none" aria-hidden="true">
      <path d="M100 15C155 15 180 60 180 110C180 175 140 225 100 245C60 225 20 175 20 110C20 60 45 15 100 15Z" stroke="rgba(255,255,255,0.06)" stroke-width="1.2" fill="rgba(255,255,255,0.02)"/>
    </svg>

    <!-- Content -->
    <div class="hero-content container">
      <!-- Badge -->
      <div class="hero-badge">
        <span class="badge-pulse"></span>
        La marketplace du jardinage en France
      </div>

      <!-- Heading -->
      <h1 class="hero-title">
        Achetez, vendez et <br>
        <span class="title-gradient">partagez votre passion</span><br>
        du jardinage
      </h1>

      <!-- Subtitle -->
      <p class="hero-subtitle">
        Trouvez des plantes rares, des graines, des outils professionnels<br class="br-hide">
        et des services de jardinage près de chez vous.
      </p>

      <!-- Search box -->
      <div class="search-box">
        <div class="search-field search-field--main">
          <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Monstera, sécateur, cours de taille..."
          />
        </div>

        <div class="search-sep"></div>

        <div class="search-field search-field--loc">
          <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <input
            v-model="searchLocation"
            type="text"
            class="search-input"
            placeholder="Ville, région..."
          />
        </div>

        <button class="search-btn" @click="search">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Rechercher
        </button>
      </div>

      <!-- Quick tags -->
      <div class="quick-tags">
        <span class="tags-label">Tendance :</span>
        <RouterLink
          v-for="tag in quickTags"
          :key="tag"
          :to="`/annonces?search=${tag}`"
          class="tag-btn"
        >{{ tag }}</RouterLink>
      </div>
    </div>

    <!-- Wave bottom -->
    <div class="hero-wave">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,0 1440,45 L1440,90 L0,90 Z" fill="white"/>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(145deg, var(--forest-900) 0%, var(--forest-800) 45%, var(--forest-700) 100%);
  padding: 120px 0 100px;
}

/* ---- Background blobs ---- */
.bg-blobs { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}
.blob-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, var(--forest-600), transparent);
  top: -150px; right: -100px;
  animation: driftA 18s ease-in-out infinite;
}
.blob-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, var(--forest-500), transparent);
  bottom: 0; left: -80px;
  opacity: 0.2;
  animation: driftB 22s ease-in-out infinite;
}
.blob-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #74c69d, transparent);
  top: 40%; left: 40%;
  opacity: 0.15;
  animation: driftA 16s ease-in-out infinite reverse;
}

@keyframes driftA {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.97); }
}
@keyframes driftB {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(25px, -30px); }
}

/* ---- Floating particles ---- */
.particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.particle {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  left: calc(var(--i) * 5.5%);
  bottom: 10%;
  animation: rise calc(6s + var(--i) * 0.7s) ease-in infinite;
  animation-delay: calc(var(--i) * 0.4s);
}
.particle:nth-child(even) {
  width: 4px; height: 4px;
  background: rgba(116, 198, 157, 0.4);
}
.particle:nth-child(3n) {
  width: 8px; height: 8px;
  background: rgba(82, 183, 136, 0.2);
  border-radius: 2px;
  transform: rotate(45deg);
}

@keyframes rise {
  0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translateY(-85vh) translateX(var(--tx, 20px)) rotate(180deg); opacity: 0; }
}

/* ---- Decorative leaves ---- */
.deco-leaf {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}
.deco-leaf--tr { width: 380px; top: -40px; right: -60px; opacity: 0.7; }
.deco-leaf--bl { width: 220px; bottom: 80px; left: -30px; opacity: 0.5; }

/* ---- Content ---- */
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.9);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 100px;
  margin-bottom: 32px;
  letter-spacing: 0.3px;
}

.badge-pulse {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #4ade80;
  position: relative;
  flex-shrink: 0;
}
.badge-pulse::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.4);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0; } }

.hero-title {
  font-size: clamp(36px, 6vw, 68px);
  font-weight: 700;
  color: white;
  line-height: 1.12;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.title-gradient {
  background: linear-gradient(135deg, var(--forest-300) 0%, var(--forest-400) 50%, #95d5b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: italic;
}

.hero-subtitle {
  font-size: clamp(15px, 2vw, 18px);
  color: rgba(255,255,255,0.68);
  max-width: 580px;
  line-height: 1.75;
  margin-bottom: 44px;
}
.br-hide { display: block; }
@media (max-width: 640px) { .br-hide { display: none; } }

/* ---- Search box ---- */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 16px;
  padding: 6px 6px 6px 0;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 740px;
  margin-bottom: 24px;
  transition: box-shadow 0.3s;
}
.search-box:focus-within {
  box-shadow: 0 24px 64px rgba(0,0,0,0.35), 0 0 0 3px rgba(82, 183, 136, 0.4);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  flex: 1;
}
.search-field--main { flex: 2; }
.search-field--loc { flex: 1; }

.search-ico { width: 18px; height: 18px; color: var(--gray-400); flex-shrink: 0; }

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--gray-800);
  width: 100%;
  font-family: var(--font-body);
}
.search-input::placeholder { color: var(--gray-400); }

.search-sep {
  width: 1px;
  height: 28px;
  background: var(--gray-200);
  flex-shrink: 0;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--forest-600);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.22s var(--ease);
}
.search-btn:hover { background: var(--forest-700); transform: translateY(-1px); box-shadow: var(--shadow-green); }

/* ---- Quick tags ---- */
.quick-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.tags-label {
  font-size: 13.5px;
  color: rgba(255,255,255,0.55);
  font-weight: 500;
}

.tag-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.16);
  color: rgba(255,255,255,0.8);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.tag-btn:hover {
  background: rgba(255,255,255,0.18);
  color: white;
  border-color: rgba(255,255,255,0.28);
}

/* ---- Wave ---- */
.hero-wave {
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  z-index: 1;
  line-height: 0;
}
.hero-wave svg { width: 100%; height: 90px; }

@media (max-width: 768px) {
  .hero { min-height: auto; padding: 100px 0 80px; }
  .search-box {
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    border-radius: 14px;
    gap: 4px;
  }
  .search-sep { display: none; }
  .search-field { padding: 10px 12px; }
  .search-btn { border-radius: 10px; justify-content: center; padding: 13px; }
  .deco-leaf--tr { width: 200px; }
  .deco-leaf--bl { display: none; }
}
</style>
