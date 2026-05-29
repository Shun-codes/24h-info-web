<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { getUnreadCount } from '@/api/messages.js'

const scrolled    = ref(true)
const menuOpen    = ref(false)
const userMenuOpen = ref(false)
const unreadCount = ref(0)
const auth        = useAuthStore()
const router      = useRouter()

const userInitial = computed(() => {
  const n = auth.user?.name || auth.user?.username || auth.user?.email || 'U'
  return n.trim()[0].toUpperCase()
})

let pollInterval = null

async function fetchUnread() {
  if (!auth.isAuthenticated) return
  try {
    const { data } = await getUnreadCount()
    unreadCount.value = data.count
  } catch {}
}

onMounted(() => {
  fetchUnread()
  pollInterval = setInterval(fetchUnread, 30_000)
  document.addEventListener('click', closeUserMenu)
})
onUnmounted(() => {
  clearInterval(pollInterval)
  document.removeEventListener('click', closeUserMenu)
})

function closeUserMenu(e) {
  if (!e.target.closest('.user-zone')) userMenuOpen.value = false
}

const logout = () => {
  auth.logout()
  unreadCount.value = 0
  menuOpen.value = false
  userMenuOpen.value = false
  router.push({ name: 'home' })
}
</script>

<template>
  <header :class="['navbar', { scrolled, 'menu-open': menuOpen }]">
    <div class="nav-inner container">

      <!-- ── Logo ── -->
      <a href="/" class="logo">
        <img src="/uniVert.png" class="logo-img" alt="L'Uni Vert" />
      </a>

      <!-- ── Nav links (centre) ── -->
      <nav class="nav-links">
        <RouterLink to="/annonces"           class="nl">Annonces</RouterLink>
        <RouterLink to="/comment-ca-marche"  class="nl">Comment ça marche</RouterLink>
      </nav>

      <!-- ── Right zone ── -->
      <div class="nav-actions">

        <!-- Messages (connecté) -->
        <RouterLink v-if="auth.isAuthenticated" to="/messages" class="icon-btn" title="Messages">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span v-if="unreadCount > 0" class="icon-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </RouterLink>

        <!-- Zone utilisateur (connecté) -->
        <div v-if="auth.isAuthenticated" class="user-zone" @click.stop="userMenuOpen = !userMenuOpen">
          <button class="user-chip">
            <span class="user-av">{{ userInitial }}</span>
            <span class="user-name">Mon compte</span>
            <svg class="user-caret" :class="{ open: userMenuOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <!-- Dropdown -->
          <div class="user-dropdown" :class="{ open: userMenuOpen }" @click.stop>
            <a href="/profil" class="dd-item" @click="userMenuOpen=false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Mon profil
            </a>
            <RouterLink to="/mes-annonces" class="dd-item" @click="userMenuOpen=false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              Mes annonces
            </RouterLink>
            <RouterLink to="/favoris" class="dd-item" @click="userMenuOpen=false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Mes favoris
            </RouterLink>
            <div class="dd-sep"></div>
            <button class="dd-item dd-logout" @click="logout">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>

        <!-- Non connecté -->
        <a v-else href="/connexion" class="btn-ghost">Se connecter</a>

        <!-- Séparateur -->
        <div class="vsep"></div>

        <!-- CTA -->
        <a href="/deposer" class="btn-cta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Déposer
        </a>
      </div>

      <!-- Hamburger -->
      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <!-- Mobile drawer -->
    <div :class="['mobile-drawer', { open: menuOpen }]">
      <RouterLink to="/annonces"          @click="menuOpen=false" class="ml">Annonces</RouterLink>
      <RouterLink to="/comment-ca-marche" @click="menuOpen=false" class="ml">Comment ça marche</RouterLink>

      <template v-if="auth.isAuthenticated">
        <RouterLink to="/messages" @click="menuOpen=false" class="ml ml-msg">
          Messages
          <span v-if="unreadCount > 0" class="ml-badge">{{ unreadCount }}</span>
        </RouterLink>
        <RouterLink to="/mes-annonces" @click="menuOpen=false" class="ml">Mes annonces</RouterLink>
        <RouterLink to="/favoris" @click="menuOpen=false" class="ml">Mes favoris</RouterLink>
        <div class="md-sep"></div>
        <a href="/profil" @click="menuOpen=false" class="ml">Mon profil</a>
        <button class="ml ml-logout" @click="logout">Se déconnecter</button>
      </template>
      <template v-else>
        <div class="md-sep"></div>
        <a href="/connexion" @click="menuOpen=false" class="ml">Se connecter</a>
      </template>

      <a href="/deposer" @click="menuOpen=false" class="ml-cta">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Déposer une annonce
      </a>
    </div>
  </header>
</template>

<style scoped>
/* ── BASE ── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  transition: background 0.35s var(--ease), box-shadow 0.35s var(--ease);
}
.navbar.scrolled {
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04);
}

.nav-inner {
  height: 68px; display: flex; align-items: center; gap: 0;
}

/* ── LOGO ── */
.logo {
  display: flex; align-items: center; gap: 9px;
  flex-shrink: 0; margin-right: 40px; text-decoration: none;
}
.logo-img {
  height: 38px; width: auto; display: block;
  transition: transform 0.3s var(--ease), opacity 0.3s;
  object-fit: contain;
}
.logo:hover .logo-img { transform: scale(1.04); }

/* ── NAV LINKS ── */
.nav-links {
  display: flex; align-items: center; gap: 2px; flex: 1;
}
.nl {
  font-size: 14px; font-weight: 500;
  color: rgba(255,255,255,0.78);
  padding: 6px 12px; border-radius: 8px;
  transition: all 0.2s; text-decoration: none;
}
.nl:hover { color: white; background: rgba(255,255,255,0.12); }
.nl.router-link-active { color: white; background: rgba(255,255,255,0.14); }
.scrolled .nl { color: var(--gray-500); }
.scrolled .nl:hover { color: var(--forest-700); background: var(--forest-50); }
.scrolled .nl.router-link-active { color: var(--forest-700); background: var(--forest-50); }

/* ── ACTIONS ── */
.nav-actions {
  display: flex; align-items: center; gap: 4px; flex-shrink: 0;
}

/* Icon button (messages) */
.icon-btn {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 9px;
  color: rgba(255,255,255,0.82); transition: all 0.2s;
}
.icon-btn:hover { background: rgba(255,255,255,0.12); color: white; }
.scrolled .icon-btn { color: var(--gray-500); }
.scrolled .icon-btn:hover { background: var(--forest-50); color: var(--forest-700); }
.icon-badge {
  position: absolute; top: 1px; right: 1px;
  min-width: 16px; height: 16px;
  background: #ef4444; color: white;
  font-size: 10px; font-weight: 700; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
}

/* User zone */
.user-zone { position: relative; }
.user-chip {
  display: flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 100px;
  padding: 5px 12px 5px 6px;
  cursor: pointer; transition: all 0.2s;
  font-family: inherit;
}
.user-chip:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.35); }
.user-av {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--forest-400); color: white;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-name { font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.9); }
.user-caret { color: rgba(255,255,255,0.6); transition: transform 0.25s; flex-shrink: 0; }
.user-caret.open { transform: rotate(180deg); }

.scrolled .user-chip {
  background: var(--forest-50); border-color: var(--forest-200);
}
.scrolled .user-chip:hover { background: var(--forest-100); }
.scrolled .user-name { color: var(--forest-800); }
.scrolled .user-caret { color: var(--forest-600); }

/* Dropdown */
.user-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: white; border: 1px solid var(--gray-100);
  border-radius: 14px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
  min-width: 192px; padding: 6px;
  opacity: 0; transform: translateY(-6px) scale(0.97);
  pointer-events: none;
  transition: opacity 0.22s, transform 0.22s;
  z-index: 100;
}
.user-dropdown.open {
  opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
}
.dd-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 9px;
  font-size: 14px; font-weight: 500; color: var(--gray-700);
  transition: all 0.18s; cursor: pointer;
  text-decoration: none; background: none; border: none;
  width: 100%; text-align: left; font-family: inherit;
}
.dd-item:hover { background: var(--forest-50); color: var(--forest-700); }
.dd-sep { height: 1px; background: var(--gray-100); margin: 4px 0; }
.dd-logout { color: #dc2626; }
.dd-logout:hover { background: #fff5f5; color: #dc2626; }

/* Ghost */
.btn-ghost {
  font-size: 14px; font-weight: 500;
  color: rgba(255,255,255,0.82);
  padding: 7px 14px; border-radius: 9px;
  transition: all 0.2s; text-decoration: none;
}
.btn-ghost:hover { color: white; background: rgba(255,255,255,0.12); }
.scrolled .btn-ghost { color: var(--gray-600); }
.scrolled .btn-ghost:hover { background: var(--forest-50); color: var(--forest-700); }

/* Separator */
.vsep {
  width: 1px; height: 22px;
  background: rgba(255,255,255,0.2);
  margin: 0 6px; flex-shrink: 0;
}
.scrolled .vsep { background: var(--gray-200); }

/* CTA */
.btn-cta {
  display: flex; align-items: center; gap: 7px;
  font-size: 14px; font-weight: 600;
  color: var(--forest-900); background: white;
  padding: 9px 18px; border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.25s var(--ease);
}
.btn-cta:hover { transform: translateY(-1px); box-shadow: 0 5px 20px rgba(0,0,0,0.22); }
.scrolled .btn-cta { background: var(--forest-600); color: white; box-shadow: none; }
.scrolled .btn-cta:hover { background: var(--forest-700); box-shadow: 0 4px 16px rgba(27,67,50,0.25); }

/* ── HAMBURGER ── */
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 8px; margin-left: auto;
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: white; border-radius: 2px;
  transition: all 0.3s var(--ease); transform-origin: center;
}
.scrolled .hamburger span { background: var(--forest-800); }
.hamburger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── MOBILE DRAWER ── */
.mobile-drawer {
  display: none; flex-direction: column;
  background: white; border-top: 1px solid var(--forest-100);
  overflow: hidden; max-height: 0;
  transition: max-height 0.4s var(--ease), padding 0.3s;
  padding: 0 16px;
}
.mobile-drawer.open { max-height: 560px; padding: 8px 16px 20px; }

.ml {
  display: flex; align-items: center;
  padding: 11px 12px; border-radius: 9px;
  font-size: 15px; color: var(--gray-600); font-weight: 500;
  transition: all 0.2s; text-decoration: none;
  gap: 8px;
}
.ml:hover { background: var(--forest-50); color: var(--forest-700); }

.ml-msg { justify-content: space-between; }
.ml-badge {
  background: #ef4444; color: white;
  font-size: 11px; font-weight: 700;
  border-radius: 10px; padding: 1px 6px;
}
.ml-logout {
  background: none; border: none; text-align: left;
  width: 100%; font-family: inherit; cursor: pointer;
  color: #dc2626; padding: 11px 12px;
  border-radius: 9px; font-size: 15px; font-weight: 500;
}
.ml-logout:hover { background: #fff5f5; }

.md-sep { height: 1px; background: var(--gray-100); margin: 6px 0; }

.ml-cta {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--forest-600); color: white;
  font-size: 15px; font-weight: 600;
  padding: 13px; border-radius: 12px; margin-top: 10px;
  text-decoration: none; transition: background 0.2s;
}
.ml-cta:hover { background: var(--forest-700); }

/* ── RESPONSIVE ── */
@media (max-width: 1060px) {
  .nav-links { display: none; }
  .nav-actions { display: none; }
  .hamburger { display: flex; }
  .mobile-drawer { display: flex; }
  .logo { margin-right: 0; }
}
</style>
