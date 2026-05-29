<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import * as listingsApi from '@/api/listings.js'
import * as messagesApi from '@/api/messages.js'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const listing    = ref(null)
const loading    = ref(true)
const error      = ref('')
const isFav      = ref(false)
const favLoading = ref(false)

const imgIndex  = ref(0)
const showMsg   = ref(false)
const msgText   = ref('')
const msgSent   = ref(false)
const msgError  = ref('')
const msgSending = ref(false)

const showReport  = ref(false)
const reportReason = ref('')
const reportDesc   = ref('')
const reportSent   = ref(false)

const deleting = ref(false)

function formatPrice(price) {
  if (price == null) return 'À négocier'
  return Number(price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function sellerInitial(name) {
  return (name || 'U').trim()[0].toUpperCase()
}

const images = computed(() => listing.value?.images || [])
const hasImages = computed(() => images.value.length > 0)

const isOwner = computed(() =>
  auth.isAuthenticated && listing.value && auth.user?.id === listing.value.seller_id
)

function prevImg() { imgIndex.value = (imgIndex.value - 1 + images.value.length) % images.value.length }
function nextImg() { imgIndex.value = (imgIndex.value + 1) % images.value.length }

async function toggleFav() {
  if (!auth.isAuthenticated) { router.push({ name: 'login', query: { redirect: route.fullPath } }); return }
  favLoading.value = true
  const previous = isFav.value
  isFav.value = !previous
  try {
    const { data } = await listingsApi.toggleFavorite(listing.value.id)
    isFav.value = data.favorited
  } catch {
    isFav.value = previous
  } finally {
    favLoading.value = false
  }
}

async function sendMessage() {
  if (!msgText.value.trim()) return
  msgSending.value = true
  msgError.value = ''
  try {
    await messagesApi.sendMessage({ listing_id: listing.value.id, content: msgText.value.trim() })
    msgSent.value = true
    msgText.value = ''
  } catch (err) {
    msgError.value = err.response?.data?.message || 'Impossible d\'envoyer le message.'
  } finally {
    msgSending.value = false
  }
}

async function submitReport() {
  if (!reportReason.value) return
  try {
    await listingsApi.reportListing(listing.value.id, { reason: reportReason.value, description: reportDesc.value })
    reportSent.value = true
  } catch { /* silent */ }
}

async function deleteListing() {
  if (!confirm('Supprimer définitivement cette annonce ?')) return
  deleting.value = true
  try {
    await listingsApi.deleteListing(listing.value.id)
    router.push({ name: 'my-listings' })
  } finally {
    deleting.value = false
  }
}

async function toggleHide() {
  const { data } = await listingsApi.updateListing(listing.value.id, { is_hidden: !listing.value.is_hidden })
  listing.value.is_hidden = data.is_hidden
}

onMounted(async () => {
  try {
    const { data } = await listingsApi.getListing(route.params.id)
    listing.value = data
    isFav.value = !!data.is_favorited
  } catch {
    error.value = 'Cette annonce est introuvable.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="detail-page">
    <div class="container" v-if="loading">
      <div class="skel-header"></div>
      <div class="skel-body">
        <div class="skel-img"></div>
        <div class="skel-side">
          <div class="skel skel-xl"></div>
          <div class="skel skel-md"></div>
          <div class="skel skel-sm"></div>
        </div>
      </div>
    </div>

    <div class="container" v-else-if="error">
      <div class="not-found">
        <div class="nf-icon"></div>
        <h1>Annonce introuvable</h1>
        <p>Cette annonce n'existe plus ou a été supprimée.</p>
        <RouterLink to="/annonces" class="btn-back">Retour aux annonces</RouterLink>
      </div>
    </div>

    <template v-else-if="listing">
      <!-- Breadcrumb -->
      <div class="breadcrumb container">
        <RouterLink to="/">Accueil</RouterLink>
        <span>›</span>
        <RouterLink to="/annonces">Annonces</RouterLink>
        <span>›</span>
        <span>{{ listing.title }}</span>
      </div>

      <div class="detail-grid container">
        <!-- Left: Gallery + Description -->
        <div class="detail-main">
          <!-- Gallery -->
          <div class="gallery">
            <div v-if="hasImages" class="gallery-main">
              <img :src="images[imgIndex]" :alt="listing.title" class="gallery-img" />
              <button v-if="images.length > 1" class="gallery-nav prev" @click="prevImg" aria-label="Précédent">‹</button>
              <button v-if="images.length > 1" class="gallery-nav next" @click="nextImg" aria-label="Suivant">›</button>
              <div v-if="images.length > 1" class="gallery-dots">
                <span v-for="(_, i) in images" :key="i" :class="['dot', { active: i === imgIndex }]" @click="imgIndex = i"></span>
              </div>
              <div v-if="images.length > 1" class="gallery-count">{{ imgIndex + 1 }} / {{ images.length }}</div>
            </div>
            <div v-else class="gallery-placeholder"></div>

            <!-- Thumbnails -->
            <div v-if="images.length > 1" class="gallery-thumbs">
              <img
                v-for="(url, i) in images"
                :key="i"
                :src="url"
                :alt="`Photo ${i + 1}`"
                :class="['thumb', { active: i === imgIndex }]"
                @click="imgIndex = i"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="detail-section">
            <h2 class="section-title-sm">Description</h2>
            <p class="description">{{ listing.description || 'Aucune description fournie.' }}</p>
          </div>

          <!-- Owner actions -->
          <div v-if="isOwner" class="owner-actions">
            <h2 class="section-title-sm">Gérer cette annonce</h2>
            <div class="owner-btns">
              <RouterLink :to="`/mes-annonces`" class="btn-edit">
                Modifier
              </RouterLink>
              <button class="btn-hide" @click="toggleHide">
                {{ listing.is_hidden ? 'Rendre visible' : 'Masquer' }}
              </button>
              <button class="btn-delete" :disabled="deleting" @click="deleteListing">
                {{ deleting ? 'Suppression…' : 'Supprimer' }}
              </button>
            </div>
          </div>

          <!-- Report -->
          <div v-if="auth.isAuthenticated && !isOwner" class="report-section">
            <button class="btn-report" @click="showReport = !showReport">
              Signaler cette annonce
            </button>
            <div v-if="showReport && !reportSent" class="report-form">
              <select v-model="reportReason" class="report-select">
                <option value="">Choisir un motif…</option>
                <option value="spam">Spam / arnaque</option>
                <option value="inappropriate">Contenu inapproprié</option>
                <option value="duplicate">Doublon</option>
                <option value="wrong_category">Mauvaise catégorie</option>
                <option value="other">Autre</option>
              </select>
              <textarea v-model="reportDesc" placeholder="Détails optionnels…" class="report-textarea" rows="3"></textarea>
              <button class="btn-report-submit" :disabled="!reportReason" @click="submitReport">Envoyer le signalement</button>
            </div>
            <p v-if="reportSent" class="report-sent">Signalement envoyé, merci.</p>
          </div>
        </div>

        <!-- Right: Info + Contact -->
        <aside class="detail-sidebar">
          <!-- Price + Status -->
          <div class="sidebar-card price-card">
            <div class="listing-status" v-if="listing.is_hidden">
              <span class="badge-hidden">Masquée</span>
            </div>
            <div class="price-display">{{ formatPrice(listing.price) }}</div>
            <div class="listing-meta-row">
              <span class="badge-cat">
                {{ listing.category_name || 'Autre' }}
              </span>
              <span class="meta-city">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ listing.city }}
              </span>
            </div>
            <h1 class="listing-title">{{ listing.title }}</h1>
            <p class="listing-date">Publiée le {{ formatDate(listing.created_at) }}</p>

            <button
              v-if="!isOwner"
              class="btn-fav-big"
              :class="{ active: isFav }"
              :disabled="favLoading"
              @click="toggleFav"
            >
              <svg viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {{ isFav ? 'Retiré des favoris' : 'Ajouter aux favoris' }}
            </button>
          </div>

          <!-- Seller card -->
          <div class="sidebar-card seller-card">
            <h3 class="sidebar-heading">Vendeur</h3>
            <div class="seller-info">
              <div class="seller-av-big">
                <img v-if="listing.seller_avatar" :src="listing.seller_avatar" :alt="listing.seller_name" />
                <span v-else>{{ sellerInitial(listing.seller_name) }}</span>
              </div>
              <div>
                <p class="seller-name-big">{{ listing.seller_name }}</p>
                <p v-if="listing.seller_city" class="seller-city-small">📍 {{ listing.seller_city }}</p>
              </div>
            </div>

            <!-- Contact -->
            <div class="contact-zone" v-if="!isOwner">
              <!-- Phone -->
              <div v-if="(listing.contact_method === 'phone' || listing.contact_method === 'both') && listing.seller_phone" class="contact-phone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a :href="`tel:${listing.seller_phone}`" class="phone-link">{{ listing.seller_phone }}</a>
              </div>

              <!-- Message -->
              <template v-if="listing.contact_method === 'message' || listing.contact_method === 'both'">
                <template v-if="auth.isAuthenticated">
                  <button v-if="!showMsg && !msgSent" class="btn-contact" @click="showMsg = true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Envoyer un message
                  </button>
                  <div v-if="showMsg && !msgSent" class="msg-form">
                    <textarea v-model="msgText" placeholder="Bonjour, je suis intéressé(e) par votre annonce…" rows="4" class="msg-textarea"></textarea>
                    <p v-if="msgError" class="msg-error">{{ msgError }}</p>
                    <div class="msg-actions">
                      <button class="btn-msg-cancel" @click="showMsg = false">Annuler</button>
                      <button class="btn-msg-send" :disabled="msgSending || !msgText.trim()" @click="sendMessage">
                        {{ msgSending ? 'Envoi…' : 'Envoyer' }}
                      </button>
                    </div>
                  </div>
                  <div v-if="msgSent" class="msg-success">
                    Message envoyé. Le vendeur vous répondra directement.
                  </div>
                </template>
                <RouterLink v-else :to="{ name: 'login', query: { redirect: route.fullPath } }" class="btn-contact">
                  Connectez-vous pour contacter
                </RouterLink>
              </template>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </main>
</template>

<style scoped>
.detail-page {
  padding: 100px 0 72px;
  background: var(--cream);
  min-height: calc(100svh - var(--nav-height));
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--gray-400);
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.breadcrumb a { color: var(--forest-600); }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb span:last-child { color: var(--gray-600); font-weight: 500; }

/* Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

/* Gallery */
.gallery { margin-bottom: 32px; }

.gallery-main {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: var(--gray-100);
  aspect-ratio: 4/3;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 40px; height: 40px;
  font-size: 22px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all 0.2s;
  z-index: 2;
}
.gallery-nav.prev { left: 12px; }
.gallery-nav.next { right: 12px; }
.gallery-nav:hover { background: white; transform: translateY(-50%) scale(1.05); }

.gallery-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}
.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.2s;
}
.dot.active { background: white; }

.gallery-count {
  position: absolute;
  bottom: 12px;
  right: 14px;
  background: rgba(0,0,0,0.45);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 100px;
  z-index: 2;
}

.gallery-placeholder {
  aspect-ratio: 4/3;
  border-radius: 18px;
  background: linear-gradient(145deg, var(--forest-700), var(--forest-500));
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-emoji { font-size: 96px; }

.gallery-thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.thumb {
  width: 72px; height: 72px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 2.5px solid transparent;
  transition: border-color 0.2s;
  flex-shrink: 0;
}
.thumb.active { border-color: var(--forest-500); }

/* Description */
.detail-section { margin-bottom: 28px; }

.section-title-sm {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  color: var(--forest-900);
  margin-bottom: 12px;
}

.description {
  font-size: 15px;
  line-height: 1.75;
  color: var(--gray-600);
  white-space: pre-wrap;
}

/* Owner actions */
.owner-actions {
  background: var(--forest-50);
  border: 1.5px solid var(--forest-100);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
}
.owner-btns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.btn-edit {
  padding: 9px 18px;
  background: var(--forest-700);
  color: white;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-edit:hover { background: var(--forest-800); }
.btn-hide {
  padding: 9px 18px;
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  color: var(--gray-700);
  transition: all 0.2s;
}
.btn-hide:hover { border-color: var(--forest-400); color: var(--forest-700); }
.btn-delete {
  padding: 9px 18px;
  background: #fef2f2;
  border: 1.5px solid #fecaca;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  color: #dc2626;
  transition: all 0.2s;
}
.btn-delete:hover:not(:disabled) { background: #fee2e2; }
.btn-delete:disabled { opacity: 0.6; cursor: not-allowed; }

/* Report */
.report-section { margin-top: 8px; }
.btn-report {
  font-size: 13px;
  color: var(--gray-400);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}
.btn-report:hover { color: var(--gray-600); }
.report-form {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.report-select, .report-textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid var(--gray-200);
  border-radius: 9px;
  font-size: 14px;
  color: var(--gray-800);
  background: white;
  outline: none;
  resize: vertical;
}
.report-select:focus, .report-textarea:focus { border-color: var(--forest-400); }
.btn-report-submit {
  padding: 9px 18px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
}
.btn-report-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.report-sent { font-size: 13px; color: var(--forest-600); margin-top: 8px; font-weight: 600; }

/* Sidebar */
.sidebar-card {
  background: white;
  border: 1.5px solid var(--gray-100);
  border-radius: 18px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 20px;
}

.badge-hidden {
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  margin-bottom: 10px;
}

.price-display {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 700;
  color: var(--forest-800);
  line-height: 1.1;
  margin-bottom: 12px;
}

.listing-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.badge-cat {
  display: inline-block;
  background: var(--forest-50);
  color: var(--forest-700);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: 100px;
  border: 1px solid var(--forest-100);
}

.meta-city {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--gray-500);
}

.listing-title {
  font-size: 20px;
  color: var(--forest-900);
  line-height: 1.3;
  margin-bottom: 8px;
}

.listing-date {
  font-size: 13px;
  color: var(--gray-400);
  margin-bottom: 16px;
}

.btn-fav-big {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px;
  border: 2px solid var(--gray-200);
  border-radius: 11px;
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-fav-big svg { width: 18px; height: 18px; color: var(--gray-400); transition: all 0.2s; }
.btn-fav-big:hover { border-color: #f43f5e; color: #f43f5e; }
.btn-fav-big:hover svg { color: #f43f5e; }
.btn-fav-big.active { border-color: #f43f5e; color: #f43f5e; }
.btn-fav-big.active svg { color: #f43f5e; }
.btn-fav-big:disabled { opacity: 0.6; cursor: wait; }

/* Seller card */
.sidebar-heading {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-400);
  margin-bottom: 14px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.seller-av-big {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--forest-600), var(--forest-400));
  color: white;
  font-size: 18px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.seller-av-big img { width: 100%; height: 100%; object-fit: cover; }

.seller-name-big { font-size: 15px; font-weight: 700; color: var(--forest-900); }
.seller-city-small { font-size: 13px; color: var(--gray-400); margin-top: 2px; }

/* Contact */
.contact-zone { display: flex; flex-direction: column; gap: 10px; }

.contact-phone {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--forest-50);
  border: 1.5px solid var(--forest-100);
  border-radius: 11px;
}
.contact-phone svg { width: 18px; height: 18px; color: var(--forest-600); flex-shrink: 0; }
.phone-link {
  font-size: 15px;
  font-weight: 700;
  color: var(--forest-700);
  letter-spacing: 0.4px;
}

.btn-contact {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 11px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}
.btn-contact:hover { background: var(--forest-800); }
.btn-contact svg { width: 18px; height: 18px; }

.msg-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--gray-200);
  border-radius: 10px;
  font-size: 14px;
  color: var(--gray-800);
  resize: vertical;
  outline: none;
  font-family: var(--font-body);
}
.msg-textarea:focus { border-color: var(--forest-500); }

.msg-error {
  font-size: 13px;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 12px;
}

.msg-actions {
  display: flex;
  gap: 8px;
}
.btn-msg-cancel {
  flex: 1;
  padding: 10px;
  border: 1.5px solid var(--gray-200);
  border-radius: 9px;
  background: white;
  color: var(--gray-600);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-msg-send {
  flex: 2;
  padding: 10px;
  background: var(--forest-700);
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-msg-send:hover:not(:disabled) { background: var(--forest-800); }
.btn-msg-send:disabled { opacity: 0.5; cursor: not-allowed; }

.msg-success {
  font-size: 14px;
  color: var(--forest-700);
  background: var(--forest-50);
  border: 1.5px solid var(--forest-100);
  border-radius: 10px;
  padding: 12px 14px;
  font-weight: 600;
}

/* Not found */
.not-found {
  text-align: center;
  padding: 80px 24px;
}
.nf-icon { font-size: 56px; margin-bottom: 16px; }
.not-found h1 { color: var(--forest-900); margin-bottom: 10px; }
.not-found p { color: var(--gray-500); margin-bottom: 24px; }
.btn-back {
  display: inline-block;
  padding: 12px 28px;
  background: var(--forest-700);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-back:hover { background: var(--forest-800); }

/* Skeleton */
.skel-header { height: 24px; background: var(--gray-100); border-radius: 8px; width: 40%; margin-bottom: 28px; animation: shimmer 1.4s infinite; background-size: 200% 100%; }
.skel-body { display: grid; grid-template-columns: 1fr 360px; gap: 32px; }
.skel-img { aspect-ratio: 4/3; background: var(--gray-100); border-radius: 18px; animation: shimmer 1.4s infinite; background-size: 200% 100%; }
.skel-side { display: flex; flex-direction: column; gap: 14px; }
.skel { height: 14px; border-radius: 7px; animation: shimmer 1.4s infinite; background-size: 200% 100%; }
.skel-xl { height: 36px; width: 60%; }
.skel-md { width: 50%; }
.skel-sm { width: 35%; }

@keyframes shimmer {
  from { background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%); background-position: 200% 0; }
  to   { background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%); background-position: -200% 0; }
}

/* Responsive */
@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
  .detail-sidebar { order: -1; }
  .skel-body { grid-template-columns: 1fr; }
}
</style>
