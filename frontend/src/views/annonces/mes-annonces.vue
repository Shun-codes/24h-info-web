<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import * as listingsApi from '@/api/listings.js'
import { getCategories } from '@/api/categories.js'

const router = useRouter()
const auth   = useAuthStore()

const listings   = ref([])
const categories = ref([])
const loading    = ref(true)
const error      = ref('')

const editId   = ref(null)
const editForm = reactive({ title: '', description: '', price: '', city: '', category_id: '', is_hidden: false })
const saving   = ref(false)
const saveErr  = ref('')

const deletingId = ref(null)

function formatPrice(price) {
  if (price == null) return 'Gratuit'
  return Number(price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function expiresIn(d) {
  const diff = Math.floor((new Date(d) - new Date()) / 86400000)
  if (diff < 0) return 'Expirée'
  if (diff === 0) return 'Expire aujourd\'hui'
  return `Expire dans ${diff}j`
}

function openEdit(listing) {
  editId.value = listing.id
  editForm.title       = listing.title
  editForm.description = listing.description || ''
  editForm.price       = listing.price || ''
  editForm.city        = listing.city || ''
  editForm.category_id = listing.category_id || ''
  editForm.is_hidden   = listing.is_hidden
  saveErr.value = ''
}

function cancelEdit() { editId.value = null }

async function saveEdit(listing) {
  saving.value = true
  saveErr.value = ''
  try {
    const { data } = await listingsApi.updateListing(listing.id, {
      title:       editForm.title,
      description: editForm.description,
      price:       editForm.price !== '' ? editForm.price : undefined,
      city:        editForm.city,
      category_id: editForm.category_id || undefined,
      is_hidden:   editForm.is_hidden,
    })
    Object.assign(listing, data)
    editId.value = null
  } catch (err) {
    saveErr.value = err.response?.data?.message || 'Erreur lors de la sauvegarde.'
  } finally {
    saving.value = false
  }
}

async function toggleHide(listing) {
  try {
    const { data } = await listingsApi.updateListing(listing.id, { is_hidden: !listing.is_hidden })
    listing.is_hidden = data.is_hidden
  } catch { /* silent */ }
}

async function deleteListing(listing) {
  if (!confirm(`Supprimer l'annonce « ${listing.title} » ? Cette action est irréversible.`)) return
  deletingId.value = listing.id
  try {
    await listingsApi.deleteListing(listing.id)
    listings.value = listings.value.filter((l) => l.id !== listing.id)
  } catch { /* silent */ } finally {
    deletingId.value = null
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) { router.push({ name: 'login', query: { redirect: '/mes-annonces' } }); return }
  try {
    const [listRes, catRes] = await Promise.all([listingsApi.getMyListings(), getCategories()])
    listings.value   = listRes.data
    categories.value = catRes.data
  } catch {
    error.value = 'Impossible de charger vos annonces.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="my-listings-page">
    <div class="page-hero">
      <div class="container">
        <p class="hero-kicker">Mon compte</p>
        <h1>Mes annonces</h1>
        <p class="hero-sub">Gérez vos annonces : modifier, masquer ou supprimer.</p>
      </div>
    </div>

    <div class="container page-body">
      <div class="top-bar">
        <span v-if="!loading" class="count">{{ listings.length }} annonce{{ listings.length !== 1 ? 's' : '' }}</span>
        <RouterLink to="/deposer" class="btn-new">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nouvelle annonce
        </RouterLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="skeleton-list">
        <div v-for="i in 3" :key="i" class="skeleton-row">
          <div class="skel-thumb"></div>
          <div class="skel-content">
            <div class="skel skel-lg"></div>
            <div class="skel skel-md"></div>
          </div>
          <div class="skel-actions">
            <div class="skel skel-btn"></div>
            <div class="skel skel-btn"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="empty-state">
        <p>{{ error }}</p>
        <button class="btn-retry" @click="$router.go(0)">Réessayer</button>
      </div>

      <!-- Empty -->
      <div v-else-if="listings.length === 0" class="empty-state">
        <h2>Aucune annonce pour l'instant</h2>
        <p>Déposez votre première annonce en quelques clics.</p>
        <RouterLink to="/deposer" class="btn-empty-cta">Déposer une annonce</RouterLink>
      </div>

      <!-- List -->
      <div v-else class="listings-list">
        <div
          v-for="listing in listings"
          :key="listing.id"
          class="listing-row"
          :class="{ hidden: listing.is_hidden, editing: editId === listing.id }"
        >
          <!-- Thumbnail -->
          <div class="row-thumb" :style="listing.thumbnail ? { backgroundImage: `url(${listing.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
            </div>

          <!-- Info -->
          <div class="row-info">
            <div class="row-badges">
              <span v-if="listing.is_hidden" class="badge-hidden">Masquée</span>
              <span v-else class="badge-active">Active</span>
              <span v-if="listing.category_name" class="badge-cat">{{ listing.category_name }}</span>
            </div>
            <h3 class="row-title">
              <RouterLink :to="`/annonces/${listing.id}`">{{ listing.title }}</RouterLink>
            </h3>
            <div class="row-meta">
              <span class="row-price">{{ formatPrice(listing.price) }}</span>
              <span class="row-dot">·</span>
              <span class="row-city">{{ listing.city }}</span>
              <span class="row-dot">·</span>
              <span class="row-date">{{ formatDate(listing.created_at) }}</span>
              <span class="row-dot">·</span>
              <span :class="['row-expires', { expired: listing.expires_at && new Date(listing.expires_at) < new Date() }]">
                {{ expiresIn(listing.expires_at) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="row-actions" v-if="editId !== listing.id">
            <button class="btn-action btn-view" @click="router.push(`/annonces/${listing.id}`)">Voir</button>
            <button class="btn-action btn-edit" @click="openEdit(listing)">Modifier</button>
            <button class="btn-action btn-hide" @click="toggleHide(listing)">
              {{ listing.is_hidden ? 'Afficher' : 'Masquer' }}
            </button>
            <button
              class="btn-action btn-delete"
              :disabled="deletingId === listing.id"
              @click="deleteListing(listing)"
            >
              {{ deletingId === listing.id ? '…' : 'Supprimer' }}
            </button>
          </div>
        </div>

        <!-- Inline edit form -->
        <transition name="slide">
          <div v-if="editId" class="edit-panel">
            <h3 class="edit-title">Modifier l'annonce</h3>

            <div class="edit-grid">
              <div class="field">
                <label>Titre</label>
                <input v-model="editForm.title" type="text" maxlength="255" />
              </div>

              <div class="field">
                <label>Ville</label>
                <input v-model="editForm.city" type="text" />
              </div>

              <div class="field">
                <label>Prix (€)</label>
                <input v-model="editForm.price" type="number" min="0" step="0.01" />
              </div>

              <div class="field">
                <label>Catégorie</label>
                <select v-model="editForm.category_id">
                  <option value="">Aucune catégorie</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.icon }} {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="field field-full">
                <label>Description</label>
                <textarea v-model="editForm.description" rows="4"></textarea>
              </div>

              <div class="field field-checkbox">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="editForm.is_hidden" />
                  <span>Masquer cette annonce</span>
                </label>
              </div>
            </div>

            <p v-if="saveErr" class="save-error">{{ saveErr }}</p>

            <div class="edit-actions">
              <button class="btn-cancel-edit" @click="cancelEdit">Annuler</button>
              <button class="btn-save-edit" :disabled="saving" @click="saveEdit(listings.find(l => l.id === editId))">
                <span v-if="saving" class="spinner"></span>
                {{ saving ? 'Sauvegarde…' : 'Enregistrer' }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
.my-listings-page {
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
.page-hero h1 { color: white; font-size: clamp(26px, 4vw, 38px); margin-bottom: 10px; }
.hero-sub { color: rgba(255,255,255,0.75); font-size: 16px; }

.page-body {
  padding-top: 36px;
  padding-bottom: 72px;
}

/* Top bar */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.count {
  font-size: 15px;
  color: var(--gray-500);
  font-weight: 500;
}

.btn-new {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  background: var(--forest-700);
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-new:hover { background: var(--forest-800); }

/* List */
.listings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.listing-row {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}
.listing-row.hidden { opacity: 0.65; }
.listing-row.editing { border-color: var(--forest-300); box-shadow: 0 0 0 3px rgba(82,183,136,0.12); }

.row-thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(145deg, var(--forest-700), var(--forest-500));
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.thumb-emoji { font-size: 32px; }

.row-info { flex: 1; min-width: 0; }

.row-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}

.badge-active {
  font-size: 11px;
  font-weight: 700;
  color: var(--forest-700);
  background: var(--forest-50);
  border: 1px solid var(--forest-200);
  padding: 2px 8px;
  border-radius: 100px;
}

.badge-hidden {
  font-size: 11px;
  font-weight: 700;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 2px 8px;
  border-radius: 100px;
}

.badge-cat {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-500);
  background: var(--gray-100);
  padding: 2px 8px;
  border-radius: 100px;
}

.row-title {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: var(--forest-900);
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-title a { color: inherit; }
.row-title a:hover { color: var(--forest-600); }

.row-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: var(--gray-400);
}

.row-price { font-weight: 600; color: var(--forest-700); }
.row-dot { color: var(--gray-300); }
.row-expires.expired { color: #dc2626; }

/* Row actions */
.row-actions {
  display: flex;
  gap: 7px;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn-action {
  padding: 7px 13px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-view {
  background: white;
  border-color: var(--gray-200);
  color: var(--gray-600);
}
.btn-view:hover { border-color: var(--forest-300); color: var(--forest-700); }

.btn-edit {
  background: var(--forest-50);
  border-color: var(--forest-200);
  color: var(--forest-700);
}
.btn-edit:hover { background: var(--forest-100); }

.btn-hide {
  background: #fef3c7;
  border-color: #fde68a;
  color: #92400e;
}
.btn-hide:hover { background: #fde68a; }

.btn-delete {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}
.btn-delete:hover:not(:disabled) { background: #fee2e2; }
.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

/* Edit panel */
.edit-panel {
  background: var(--forest-50);
  border: 1.5px solid var(--forest-200);
  border-radius: 16px;
  padding: 24px;
  margin-top: -4px;
}

.edit-title {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  color: var(--forest-900);
  margin-bottom: 20px;
}

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 16px;
}

.field-full { grid-column: 1 / -1; }

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: 6px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid var(--gray-200);
  border-radius: 9px;
  font-size: 14px;
  color: var(--gray-800);
  background: white;
  outline: none;
  font-family: var(--font-body);
  transition: border-color 0.15s;
}
.field input:focus,
.field select:focus,
.field textarea:focus { border-color: var(--forest-500); }
.field textarea { resize: vertical; }

.field-checkbox { display: flex; align-items: center; }
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 0;
}
.checkbox-label input { width: 16px; height: 16px; cursor: pointer; }

.save-error {
  font-size: 13px;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
}

.edit-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel-edit {
  padding: 10px 20px;
  border: 1.5px solid var(--gray-200);
  border-radius: 9px;
  background: white;
  color: var(--gray-600);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel-edit:hover { border-color: var(--forest-300); color: var(--forest-700); }

.btn-save-edit {
  padding: 10px 24px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s;
}
.btn-save-edit:hover:not(:disabled) { background: var(--forest-800); }
.btn-save-edit:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Skeleton */
.skeleton-list { display: flex; flex-direction: column; gap: 12px; }
.skeleton-row {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.skel-thumb {
  width: 80px; height: 80px;
  border-radius: 12px;
  flex-shrink: 0;
  animation: shimmer 1.4s infinite;
}
.skel-content { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.skel-actions { display: flex; gap: 8px; }
.skel {
  height: 12px;
  border-radius: 6px;
  animation: shimmer 1.4s infinite;
}
.skel-lg { width: 60%; height: 14px; }
.skel-md { width: 40%; }
.skel-btn { width: 64px; height: 30px; border-radius: 8px; }
@keyframes shimmer {
  from { background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%); background-position: 200% 0; background-size: 200% 100%; }
  to   { background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%); background-position: -200% 0; background-size: 200% 100%; }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 72px 24px;
  color: var(--gray-500);
}
.empty-icon { font-size: 52px; margin-bottom: 16px; }
.empty-state h2 { color: var(--forest-900); margin-bottom: 8px; font-size: 20px; }
.empty-state p { margin-bottom: 24px; }

.btn-empty-cta, .btn-retry {
  display: inline-block;
  padding: 12px 28px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-empty-cta:hover, .btn-retry:hover { background: var(--forest-800); }

/* Slide transition */
.slide-enter-active, .slide-leave-active { transition: all 0.25s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* Responsive */
@media (max-width: 700px) {
  .listing-row { flex-wrap: wrap; }
  .row-thumb { width: 60px; height: 60px; }
  .row-actions { width: 100%; justify-content: flex-start; }
  .edit-grid { grid-template-columns: 1fr; }
  .field-full { grid-column: 1; }
}
</style>
