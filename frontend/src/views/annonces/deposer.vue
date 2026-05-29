<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import * as listingsApi from '@/api/listings.js'
import { getCategories } from '@/api/categories.js'

const router = useRouter()
const auth   = useAuthStore()

const categories = ref([])
const loading    = ref(false)
const error      = ref('')
const previews   = ref([])
const files      = ref([])

const form = reactive({
  title:          '',
  category_id:    '',
  description:    '',
  price:          '',
  city:           '',
  contact_method: 'message',
})

const step = ref(1) // 1 = infos, 2 = photos + contact

const CONTACT_OPTIONS = [
  { value: 'message', label: 'Messagerie interne' },
  { value: 'phone',   label: 'Téléphone uniquement' },
  { value: 'both',    label: 'Les deux' },
]

const isDragging = ref(false)

function addFiles(incoming) {
  const combined = [...files.value, ...Array.from(incoming)].slice(0, 5)
  files.value = combined
  previews.value = combined.map((f) => URL.createObjectURL(f))
}

function onFilesChange(e) {
  addFiles(e.target.files || [])
}

function onDrop(e) {
  isDragging.value = false
  const dropped = Array.from(e.dataTransfer?.files || []).filter((f) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
  )
  addFiles(dropped)
}

function removeFile(index) {
  URL.revokeObjectURL(previews.value[index])
  files.value.splice(index, 1)
  previews.value.splice(index, 1)
}

const step1Valid = computed(() => form.title.trim() && form.price && form.city.trim())
const step2Valid = computed(() => step1Valid.value && files.value.length > 0)

async function submit() {
  if (!step2Valid.value) return

  error.value = ''
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('title',          form.title.trim())
    fd.append('description',    form.description.trim())
    fd.append('price',          form.price)
    fd.append('city',           form.city.trim())
    fd.append('contact_method', form.contact_method)
    if (form.category_id) fd.append('category_id', form.category_id)
    files.value.forEach((f) => fd.append('images', f))

    const { data } = await listingsApi.createListing(fd)
    router.push({ name: 'listing', params: { id: data.id } })
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue.'
    step.value = 1
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/deposer' } })
    return
  }
  try {
    const { data } = await getCategories()
    categories.value = data
  } catch { /* silent */ }
})
</script>

<template>
  <main class="deposer-page">
    <div class="page-hero">
      <div class="container">
        <p class="hero-kicker">Nouveau</p>
        <h1>Déposer une annonce</h1>
        <p class="hero-sub">Rejoignez notre communauté et trouvez un acheteur en quelques clics.</p>
      </div>
    </div>

    <div class="form-wrapper container">
      <!-- Progress -->
      <div class="steps-bar">
        <div :class="['step-item', { active: step >= 1, done: step > 1 }]" @click="step = 1">
          <span class="step-num">1</span>
          <span class="step-lbl">Informations</span>
        </div>
        <div class="step-line"></div>
        <div :class="['step-item', { active: step >= 2 }]">
          <span class="step-num">2</span>
          <span class="step-lbl">Photos & Contact</span>
        </div>
      </div>

      <form @submit.prevent="submit" novalidate>
        <!-- Step 1 -->
        <div v-show="step === 1" class="form-card">
          <h2 class="form-section-title">Décrivez votre annonce</h2>

          <div class="field">
            <label for="title">Titre <span class="req">*</span></label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              maxlength="255"
              placeholder="Ex : Monstera Deliciosa XXL — très belle plante"
              required
            />
            <span class="char-count">{{ form.title.length }}/255</span>
          </div>

          <div class="field-grid">
            <div class="field">
              <label for="category">Catégorie</label>
              <select id="category" v-model="form.category_id">
                <option value="">Choisir une catégorie</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="city">Ville <span class="req">*</span></label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                placeholder="Lyon"
                required
              />
            </div>
          </div>

          <div class="field">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="5"
              placeholder="Décrivez votre article en détail : état, dimensions, variété…"
            ></textarea>
          </div>

          <div class="field field-price">
            <label for="price">Prix (€) <span class="req">*</span></label>
            <div class="price-input-wrap">
              <span class="currency-symbol">€</span>
              <input
                id="price"
                v-model="form.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                required
              />
            </div>
            <p class="field-hint">Mettez 0 pour un don ou objet gratuit.</p>
          </div>

          <div class="step-actions">
            <button type="button" class="btn-next" :disabled="!step1Valid" @click="step = 2">
              Continuer → Photos & Contact
            </button>
          </div>
        </div>

        <!-- Step 2 -->
        <div v-show="step === 2" class="form-card">
          <h2 class="form-section-title">Photos & moyen de contact</h2>

          <!-- Photo upload -->
          <div class="field">
            <label>Photos <span class="req">*</span> <span class="field-hint-inline">(max. 5)</span></label>

            <div
              class="upload-zone"
              :class="{ 'has-photos': previews.length > 0, dragging: isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <div v-if="previews.length > 0" class="previews-grid">
                <div v-for="(src, i) in previews" :key="i" class="preview-thumb">
                  <img :src="src" alt="Photo" />
                  <button type="button" class="remove-photo" @click="removeFile(i)" aria-label="Supprimer">×</button>
                  <span v-if="i === 0" class="main-badge">Principal</span>
                </div>
                <label v-if="previews.length < 5" class="add-more-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple class="file-input-hidden" @change="onFilesChange" />
                </label>
              </div>

              <label v-else class="upload-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <span class="upload-label-text">Cliquez ou glissez vos photos ici</span>
                <span class="upload-label-sub">JPEG, PNG, WebP — max. 5 photos</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple class="file-input-hidden" @change="onFilesChange" />
              </label>
            </div>
          </div>

          <!-- Contact method -->
          <div class="field">
            <label>Moyen de contact <span class="req">*</span></label>
            <div class="contact-options">
              <label
                v-for="opt in CONTACT_OPTIONS"
                :key="opt.value"
                :class="['contact-option', { selected: form.contact_method === opt.value }]"
              >
                <input type="radio" :value="opt.value" v-model="form.contact_method" class="radio-hidden" />
                <span class="opt-label">{{ opt.label }}</span>
              </label>
            </div>

            <p v-if="form.contact_method === 'phone' || form.contact_method === 'both'" class="field-hint">
              Votre numéro de téléphone doit être renseigné dans votre
              <RouterLink to="/profil" class="hint-link">profil</RouterLink>.
            </p>
          </div>

          <!-- Error -->
          <p v-if="files.length === 0" class="form-error form-error--soft">Au moins une photo est requise pour publier.</p>
          <p v-else-if="error" class="form-error">{{ error }}</p>

          <div class="step-actions">
            <button type="button" class="btn-back-step" @click="step = 1">← Retour</button>
            <button type="submit" class="btn-submit" :disabled="loading || !step2Valid">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Publication…' : 'Publier l\'annonce' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.deposer-page {
  min-height: calc(100svh - var(--nav-height));
  background: var(--cream);
}

.page-hero {
  background: linear-gradient(135deg, var(--forest-800), var(--forest-600));
  padding: 96px 0 48px;
  color: white;
}

.hero-kicker {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 5px 13px;
  border-radius: 100px;
  margin-bottom: 14px;
}

.page-hero h1 { color: white; font-size: clamp(26px, 4vw, 40px); margin-bottom: 10px; }
.hero-sub { color: rgba(255,255,255,0.75); font-size: 16px; }

.form-wrapper {
  padding-top: 36px;
  padding-bottom: 72px;
  max-width: 680px;
}

/* Steps */
.steps-bar {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  opacity: 0.45;
  transition: opacity 0.2s;
}
.step-item.active { opacity: 1; }
.step-item.done { opacity: 0.75; }

.step-num {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--gray-200);
  color: var(--gray-600);
  font-size: 13px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.step-item.active .step-num { background: var(--forest-700); color: white; }
.step-item.done .step-num { background: var(--forest-500); color: white; }

.step-lbl {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-600);
}
.step-item.active .step-lbl { color: var(--forest-800); }

.step-line {
  flex: 1;
  height: 2px;
  background: var(--gray-200);
  margin: 0 16px;
}

/* Form card */
.form-card {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 20px;
  padding: 36px;
  box-shadow: var(--shadow-sm);
}

.form-section-title {
  font-family: var(--font-heading);
  font-size: 22px;
  color: var(--forest-900);
  margin-bottom: 28px;
}

/* Fields */
.field {
  margin-bottom: 22px;
  position: relative;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.req { color: #dc2626; }
.field-hint-inline { font-size: 12px; font-weight: 400; color: var(--gray-400); }

input[type='text'],
input[type='number'],
select,
textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--gray-200);
  border-radius: 10px;
  font-size: 15px;
  color: var(--gray-800);
  background: white;
  outline: none;
  transition: border-color 0.15s;
  font-family: var(--font-body);
}
input[type='text']:focus,
input[type='number']:focus,
select:focus,
textarea:focus { border-color: var(--forest-500); }
textarea { resize: vertical; }

.char-count {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 11.5px;
  color: var(--gray-400);
  pointer-events: none;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 22px;
}

/* Price */
.price-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.currency-symbol {
  position: absolute;
  left: 14px;
  font-size: 16px;
  color: var(--gray-400);
  font-weight: 600;
  z-index: 1;
}
.price-input-wrap input {
  padding-left: 32px;
}

.field-hint { font-size: 12.5px; color: var(--gray-400); margin-top: 6px; }
.hint-link { color: var(--forest-600); text-decoration: underline; }

/* Upload zone */
.upload-zone {
  border: 2px dashed var(--gray-200);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.upload-zone:hover { border-color: var(--forest-300); }
.upload-zone.has-photos { border-style: solid; border-color: var(--gray-200); }

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  cursor: pointer;
  gap: 8px;
}
.upload-placeholder svg { width: 40px; height: 40px; color: var(--gray-300); }
.upload-label-text { font-size: 14.5px; font-weight: 600; color: var(--gray-600); }
.upload-label-sub { font-size: 12.5px; color: var(--gray-400); }

.file-input-hidden {
  position: absolute;
  width: 1px; height: 1px;
  opacity: 0;
  pointer-events: none;
}

.previews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
  padding: 12px;
}

.preview-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: var(--gray-100);
}
.preview-thumb img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

.remove-photo {
  position: absolute;
  top: 4px; right: 4px;
  width: 22px; height: 22px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
}

.main-badge {
  position: absolute;
  bottom: 5px; left: 5px;
  background: var(--forest-700);
  color: white;
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.add-more-btn {
  aspect-ratio: 1;
  border-radius: 10px;
  border: 2px dashed var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.add-more-btn:hover { border-color: var(--forest-400); }
.add-more-btn svg { width: 24px; height: 24px; color: var(--gray-400); }

/* Contact options */
.contact-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.upload-zone.dragging {
  border-color: var(--forest-500);
  background: var(--forest-50);
}

.contact-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 12px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.contact-option:hover { border-color: var(--forest-300); background: var(--forest-50); }
.contact-option.selected { border-color: var(--forest-600); background: var(--forest-50); }

.radio-hidden { display: none; }

.opt-label { font-size: 13px; font-weight: 600; color: var(--gray-600); }
.contact-option.selected .opt-label { color: var(--forest-700); }

/* Error */
.form-error {
  color: #dc2626;
  font-size: 13.5px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 9px;
  padding: 10px 14px;
  margin-bottom: 16px;
}
.form-error--soft {
  color: #92400e;
  background: #fffbeb;
  border-color: #fde68a;
}

/* Actions */
.step-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-next {
  padding: 13px 28px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-next:hover:not(:disabled) { background: var(--forest-800); }
.btn-next:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-back-step {
  padding: 13px 20px;
  border: 1.5px solid var(--gray-200);
  border-radius: 11px;
  background: white;
  color: var(--gray-600);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back-step:hover { border-color: var(--forest-300); color: var(--forest-700); }

.btn-submit {
  padding: 13px 32px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) { background: var(--forest-800); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .form-card { padding: 24px 20px; }
  .field-grid { grid-template-columns: 1fr; }
  .contact-options { grid-template-columns: 1fr; }
  .step-actions { flex-direction: column-reverse; }
  .btn-next, .btn-submit, .btn-back-step { width: 100%; justify-content: center; }
}
</style>
