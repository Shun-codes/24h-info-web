<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { deleteAccount, updateProfile } from '@/api/users.js'
import { getMe } from '@/api/auth.js'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  name: '',
  phone: '',
  city: '',
  avatar: null,
})

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const avatarPreview = ref('')

const initials = computed(() => {
  const source = form.name || auth.user?.name || 'U'
  return source
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
})

function syncForm(user) {
  form.email = user.email || ''
  form.name = user.name || ''
  form.phone = user.phone || ''
  form.city = user.city || ''
  avatarPreview.value = user.avatar_url || ''
}

onMounted(async () => {
  try {
    loading.value = true
    const { data } = await getMe()
    auth.setUser(data)
    syncForm(data)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Impossible de charger le profil'
  } finally {
    loading.value = false
  }
})

function onAvatarChange(event) {
  const file = event.target.files?.[0] ?? null
  form.avatar = file

  if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }

  avatarPreview.value = file ? URL.createObjectURL(file) : (auth.user?.avatar_url || '')
}

async function onSubmit() {
  try {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const payload = new FormData()
    payload.append('email', form.email)
    payload.append('name', form.name)
    payload.append('phone', form.phone)
    payload.append('city', form.city)

    if (form.avatar) {
      payload.append('avatar', form.avatar)
    }

    const { data } = await updateProfile(payload)
    auth.setUser(data)
    syncForm(data)
    successMessage.value = 'Profil mis à jour avec succès'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Impossible de mettre à jour le profil'
  } finally {
    saving.value = false
  }
}

async function onDeleteAccount() {
  const confirmed = window.confirm('Supprimer définitivement votre compte ? Cette action est irréversible.')
  if (!confirmed) return

  try {
    deleting.value = true
    await deleteAccount()
    auth.logout()
    router.push({ name: 'home' })
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Impossible de supprimer le compte'
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <main class="profile-page">
    <section class="profile-hero container">
      <div class="profile-card hero-card">
        <div class="profile-badge">Mon compte</div>
        <h1>Gérer mon profil</h1>
        <p>
          Mets à jour tes informations personnelles, change ta photo de profil et supprime ton compte si nécessaire.
        </p>
      </div>
    </section>

    <section class="container profile-grid" v-if="!loading">
      <article class="profile-card profile-summary">
        <div class="avatar-ring">
          <img v-if="avatarPreview" :src="avatarPreview" alt="Photo de profil" class="avatar-image" />
          <span v-else>{{ initials }}</span>
        </div>
        <h2>{{ form.name || 'Ton profil' }}</h2>
        <p>{{ form.email || 'Aucun email renseigné' }}</p>
        <dl class="profile-meta">
          <div>
            <dt>Ville</dt>
            <dd>{{ form.city || 'Non renseignée' }}</dd>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>{{ form.phone || 'Non renseigné' }}</dd>
          </div>
        </dl>
      </article>

      <article class="profile-card profile-form-card">
        <div class="section-heading">
          <div>
            <span class="section-kicker">Informations</span>
            <h2>Modifier le profil</h2>
          </div>
        </div>

        <form class="profile-form" @submit.prevent="onSubmit">
          <label>
            <span>Email</span>
            <input v-model="form.email" type="email" autocomplete="email" required />
          </label>

          <label>
            <span>Nom</span>
            <input v-model="form.name" type="text" autocomplete="name" required />
          </label>

          <div class="field-grid">
            <label>
              <span>Téléphone</span>
              <input v-model="form.phone" type="tel" autocomplete="tel" placeholder="06 12 34 56 78" />
            </label>

            <label>
              <span>Ville</span>
              <input v-model="form.city" type="text" autocomplete="address-level2" placeholder="Lyon" />
            </label>
          </div>

          <label>
            <span>Photo de profil</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" @change="onAvatarChange" />
          </label>

          <p class="form-feedback success" v-if="successMessage">{{ successMessage }}</p>
          <p class="form-feedback error" v-if="errorMessage">{{ errorMessage }}</p>

          <div class="form-actions">
            <button type="submit" class="primary-btn" :disabled="saving">
              {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
            </button>
            <button type="button" class="danger-btn" :disabled="deleting" @click="onDeleteAccount">
              {{ deleting ? 'Suppression...' : 'Supprimer mon compte' }}
            </button>
          </div>
        </form>
      </article>
    </section>

    <section class="container profile-loading" v-else>
      <div class="profile-card">
        <p>Chargement du profil...</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  padding: 120px 0 72px;
  background: linear-gradient(180deg, rgba(82,183,136,0.08) 0%, rgba(255,255,255,1) 38%);
}

.profile-hero {
  margin-bottom: 28px;
}

.profile-card {
  background: white;
  border: 1px solid rgba(27,67,50,0.08);
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(27,67,50,0.08);
}

.hero-card {
  padding: 28px;
  max-width: 760px;
}

.profile-badge,
.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--forest-50);
  color: var(--forest-700);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-card h1,
.profile-form-card h2,
.profile-summary h2 {
  margin: 14px 0 10px;
  color: var(--forest-900);
}

.hero-card p {
  max-width: 64ch;
  color: var(--gray-600);
  line-height: 1.7;
}

.profile-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.profile-summary,
.profile-form-card,
.profile-loading .profile-card {
  padding: 24px;
}

.profile-summary {
  position: sticky;
  top: 112px;
}

.avatar-ring {
  width: 96px;
  height: 96px;
  border-radius: 28px;
  background: linear-gradient(135deg, var(--forest-600), var(--forest-400));
  color: white;
  display: grid;
  place-items: center;
  font-size: 28px;
  font-weight: 800;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-summary p {
  color: var(--gray-600);
  margin-bottom: 20px;
}

.profile-meta {
  display: grid;
  gap: 14px;
}

.profile-meta dt {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gray-400);
  margin-bottom: 4px;
}

.profile-meta dd {
  margin: 0;
  color: var(--gray-700);
  font-weight: 600;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.profile-form {
  display: grid;
  gap: 16px;
}

label span {
  display: block;
  margin-bottom: 7px;
  font-size: 14px;
  font-weight: 600;
  color: var(--forest-900);
}

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='file'] {
  width: 100%;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-feedback {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.form-feedback.success {
  color: #1b7f4c;
}

.form-feedback.error {
  color: #c1121f;
}

.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn,
.danger-btn {
  border: none;
  border-radius: 14px;
  padding: 13px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.primary-btn {
  background: var(--forest-700);
  color: white;
  box-shadow: 0 10px 24px rgba(27,67,50,0.18);
}

.danger-btn {
  background: #f7e6e8;
  color: #a4161a;
}

.primary-btn:hover,
.danger-btn:hover {
  transform: translateY(-1px);
}

.primary-btn:disabled,
.danger-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.profile-loading {
  display: grid;
}

@media (max-width: 960px) {
  .profile-page {
    padding-top: 104px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .hero-card,
  .profile-summary,
  .profile-form-card,
  .profile-loading .profile-card {
    padding: 20px;
    border-radius: 22px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .primary-btn,
  .danger-btn {
    width: 100%;
  }
}
</style>
