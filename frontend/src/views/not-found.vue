<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="not-found">
    <div class="not-found-inner">
      <span class="not-found-emoji">🌱</span>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas ou a été déplacée.</p>
      <button @click="router.push('/')">Retour à l'accueil</button>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.not-found-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.not-found-emoji { font-size: 64px; }
h1 { font-family: var(--font-heading); font-size: 32px; color: var(--forest-800); }
p  { color: var(--gray-500); }
button {
  background: var(--forest-600); color: white; border: none;
  padding: 12px 24px; border-radius: 10px; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
button:hover { background: var(--forest-700); }
</style>
