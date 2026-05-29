<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useScrollParallax, parallaxStyle } from '@/composables/useScrollParallax.js'

const pageRef = ref(null)
const sy  = useScrollParallax()
const lp1 = parallaxStyle(pageRef, sy, 0.10)
const lp2 = parallaxStyle(pageRef, sy, 0.14)
const lp3 = parallaxStyle(pageRef, sy, 0.07)

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

const email    = ref('')
const password = ref('')
const showPwd  = ref(false)
const loading  = ref(false)
const error    = ref('')

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs.'
    return
  }
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page" ref="pageRef">
    <!-- Parallax plant decorations -->
    <div class="auth-plants" aria-hidden="true">
      <img src="/Plant - Flat - 06.png"               class="ap ap-1" :style="lp1" />
      <img src="/Plant - Flat - 10.png"               class="ap ap-2" :style="lp2" />
      <img src="/Plant - Gradient - Outline - 05.png" class="ap ap-3" :style="lp3" />
    </div>
    <div class="auth-card">
      <div class="auth-header">
        <h1>Connexion</h1>
        <p>Heureux de vous revoir sur L'Uni Vert</p>
      </div>

      <form @submit.prevent="submit" novalidate>
        <div class="field">
          <label for="email">Adresse e-mail</label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            placeholder="votre@email.com"
            :disabled="loading"
            @input="error = ''"
          />
        </div>

        <div class="field">
          <label for="password">Mot de passe</label>
          <div class="input-group">
            <input
              id="password"
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              :disabled="loading"
              @input="error = ''"
            />
            <button type="button" class="toggle-pwd" @click="showPwd = !showPwd" tabindex="-1">
              <svg v-if="showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="error-msg" role="alert">{{ error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner" aria-hidden="true"></span>
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <p class="auth-footer">
        Pas encore de compte ?
        <RouterLink to="/inscription">Créer un compte</RouterLink>
      </p>
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: calc(100svh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--cream);
  position: relative; overflow: hidden;
}
.auth-plants { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.ap { position: absolute; height: auto; will-change: transform; user-select: none; -webkit-user-drag: none; }
.ap-1 { width: min(30vw, 320px); bottom: -20px; left: -60px;  opacity: 0.18; rotate: -18deg; }
.ap-2 { width: min(22vw, 240px); top: 5%;       right: -50px; opacity: 0.16; rotate: 12deg; }
.ap-3 { width: min(16vw, 180px); top: 20%;      left: 3%;     opacity: 0.12; }
.auth-card { position: relative; z-index: 1; }

.auth-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-md);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 28px;
  color: var(--forest-900);
  margin-bottom: 6px;
}

.auth-header p {
  color: var(--gray-500);
  font-size: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
}

input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--gray-300);
  border-radius: 8px;
  font-size: 15px;
  color: var(--gray-800);
  background: var(--white);
  transition: border-color 0.15s;
  outline: none;
}

input:focus {
  border-color: var(--forest-500);
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-group {
  position: relative;
  display: flex;
}

.input-group input {
  padding-right: 44px;
}

.toggle-pwd {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 4px;
}

.error-msg {
  color: #dc2626;
  font-size: 13.5px;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: var(--forest-700);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
  margin-bottom: 20px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--forest-800);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.auth-footer {
  text-align: center;
  font-size: 14px;
  color: var(--gray-500);
}

.auth-footer a {
  color: var(--forest-600);
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
