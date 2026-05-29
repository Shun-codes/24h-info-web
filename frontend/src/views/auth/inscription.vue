<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useScrollParallax, parallaxStyle } from '@/composables/useScrollParallax.js'

const pageRef = ref(null)
const sy  = useScrollParallax()
const lp1 = parallaxStyle(pageRef, sy, 0.10)
const lp2 = parallaxStyle(pageRef, sy, 0.14)
const lp3 = parallaxStyle(pageRef, sy, 0.07)

const router = useRouter()
const auth   = useAuthStore()

const name     = ref('')
const email    = ref('')
const password = ref('')
const confirm  = ref('')
const city     = ref('')
const showPwd  = ref(false)
const showCfm  = ref(false)
const loading  = ref(false)
const error    = ref('')

const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8)  score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => {
  const labels = ['', 'Très faible', 'Faible', 'Correct', 'Fort', 'Très fort']
  return labels[passwordStrength.value] || ''
})

const strengthClass = computed(() => {
  if (passwordStrength.value <= 1) return 'weak'
  if (passwordStrength.value <= 2) return 'fair'
  if (passwordStrength.value <= 3) return 'good'
  return 'strong'
})

function validate() {
  if (!name.value.trim())  return 'Le nom est requis.'
  if (!email.value.trim()) return 'L\'e-mail est requis.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return 'Adresse e-mail invalide.'
  if (password.value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
  if (password.value !== confirm.value) return 'Les mots de passe ne correspondent pas.'
  return null
}

async function submit() {
  error.value = validate() || ''
  if (error.value) return

  loading.value = true
  try {
    await auth.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      city: city.value.trim() || undefined,
    })
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page" ref="pageRef">
    <div class="auth-plants" aria-hidden="true">
      <img src="/Plant - Flat - 03.png"               class="ap ap-1" :style="lp1" />
      <img src="/Plant - Flat - 08.png"               class="ap ap-2" :style="lp2" />
      <img src="/Plant - Gradient - Outline - 01.png" class="ap ap-3" :style="lp3" />
    </div>
    <div class="auth-card">
      <div class="auth-header">
        <h1>Créer un compte</h1>
        <p>Rejoignez la communauté L'Uni Vert</p>
      </div>

      <form @submit.prevent="submit" novalidate>
        <div class="field">
          <label for="name">Nom complet <span class="required">*</span></label>
          <input
            id="name"
            v-model.trim="name"
            type="text"
            autocomplete="name"
            placeholder="Jean Dupont"
            :disabled="loading"
            @input="error = ''"
          />
        </div>

        <div class="field">
          <label for="email">Adresse e-mail <span class="required">*</span></label>
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
          <label for="city">Ville (optionnel)</label>
          <input
            id="city"
            v-model.trim="city"
            type="text"
            autocomplete="address-level2"
            placeholder="Paris"
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="password">Mot de passe <span class="required">*</span></label>
          <div class="input-group">
            <input
              id="password"
              v-model="password"
              :type="showPwd ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="8 caractères minimum"
              :disabled="loading"
              @input="error = ''"
            />
            <button type="button" class="toggle-pwd" @click="showPwd = !showPwd" tabindex="-1">
              <svg v-if="showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div v-if="password" class="strength">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :class="strengthClass"
                :style="{ width: (passwordStrength / 5 * 100) + '%' }"
              ></div>
            </div>
            <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
          </div>
        </div>

        <div class="field">
          <label for="confirm">Confirmer le mot de passe <span class="required">*</span></label>
          <div class="input-group">
            <input
              id="confirm"
              v-model="confirm"
              :type="showCfm ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="••••••••"
              :disabled="loading"
              @input="error = ''"
            />
            <button type="button" class="toggle-pwd" @click="showCfm = !showCfm" tabindex="-1">
              <svg v-if="showCfm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <p v-if="error" class="error-msg" role="alert">{{ error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner" aria-hidden="true"></span>
          {{ loading ? 'Création…' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="auth-footer">
        Déjà un compte ?
        <RouterLink to="/connexion">Se connecter</RouterLink>
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
.ap-1 { width: min(28vw, 300px); bottom: -20px; left: -50px;  opacity: 0.17; rotate: -18deg; }
.ap-2 { width: min(20vw, 220px); top: 5%;       right: -40px; opacity: 0.15; rotate: 12deg; }
.ap-3 { width: min(14vw, 160px); top: 20%;      left: 4%;     opacity: 0.11; }
.auth-card { position: relative; z-index: 1; }

.auth-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
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
  margin-bottom: 18px;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
}

.required {
  color: #dc2626;
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

.strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.2s, background 0.2s;
}

.strength-fill.weak   { background: #dc2626; }
.strength-fill.fair   { background: #f97316; }
.strength-fill.good   { background: #eab308; }
.strength-fill.strong { background: var(--forest-500); }

.strength-label {
  font-size: 12px;
  font-weight: 500;
  min-width: 64px;
}

.strength-label.weak   { color: #dc2626; }
.strength-label.fair   { color: #f97316; }
.strength-label.good   { color: #eab308; }
.strength-label.strong { color: var(--forest-600); }

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
