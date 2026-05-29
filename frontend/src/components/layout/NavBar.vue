<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { getUnreadCount } from '@/api/messages.js'
import { connectSocket, getSocket, disconnectSocket } from '@/api/socket.js'

const scrolled    = ref(true)
const menuOpen    = ref(false)
const unreadCount = ref(0)
const auth        = useAuthStore()
const router      = useRouter()

async function fetchUnread() {
  if (!auth.isAuthenticated) return
  try {
    const { data } = await getUnreadCount()
    unreadCount.value = data.count
  } catch {}
}

onMounted(() => {
  if (!auth.isAuthenticated) return
  fetchUnread()

  const socket = connectSocket(auth.token)
  socket.on('new_message', (msg) => {
    if (msg.sender_id !== auth.user?.id) {
      unreadCount.value++
    }
  })
})

onUnmounted(() => {
  getSocket()?.off('new_message')
})

const logout = () => {
  auth.logout()
  unreadCount.value = 0
  menuOpen.value = false
  disconnectSocket()
  router.push({ name: 'home' })
}
</script>

<template>
  <header :class="['navbar', { scrolled, 'menu-open': menuOpen }]">
    <div class="nav-inner container">
      <a href="/" class="logo">
        <svg class="logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3C18 3 6 10 6 21C6 27.6 11.4 33 18 33C24.6 33 30 27.6 30 21C30 10 18 3 18 3Z" fill="#52b788"/>
          <path d="M18 3C18 3 30 10 30 21" stroke="#1b4332" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M18 33V17" stroke="#1b4332" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M18 20C18 20 14 17 11 18" stroke="#1b4332" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18 24C18 24 22 21 25 22" stroke="#1b4332" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <span class="logo-text">L'Uni <em>Vert</em></span>
      </a>

      <nav class="nav-links">
        <RouterLink to="/annonces">Annonces</RouterLink>
      </nav>

      <div class="nav-actions">
        <RouterLink v-if="auth.isAuthenticated" to="/messages" class="msg-btn" title="Messages">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span v-if="unreadCount > 0" class="msg-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/mes-annonces" class="btn-ghost">Mes annonces</RouterLink>
        <a v-if="auth.isAuthenticated" href="/profil" class="btn-ghost">Mon profil</a>
        <button v-if="auth.isAuthenticated" class="btn-ghost logout-btn" @click="logout">Se déconnecter</button>
        <a v-else href="/connexion" class="btn-ghost">Se connecter</a>
        <a href="/deposer" class="btn-cta">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Déposer une annonce
        </a>
      </div>

      <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <div :class="['mobile-drawer', { open: menuOpen }]">
      <RouterLink to="/annonces" @click="menuOpen=false">Annonces</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" to="/mes-annonces" @click="menuOpen=false">Mes annonces</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" to="/messages" @click="menuOpen=false" class="mobile-messages">
        Messages
        <span v-if="unreadCount > 0" class="mobile-badge">{{ unreadCount }}</span>
      </RouterLink>
      <div class="mobile-divider"></div>
      <a v-if="auth.isAuthenticated" href="/profil" class="mobile-login" @click="menuOpen=false">Mon profil</a>
      <button v-if="auth.isAuthenticated" class="mobile-login logout-btn" @click="logout">Se déconnecter</button>
      <a v-else href="/connexion" class="mobile-login">Se connecter</a>
      <a href="/deposer" class="mobile-cta">Déposer une annonce</a>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  transition: background 0.35s var(--ease), box-shadow 0.35s var(--ease);
}

.navbar.scrolled {
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05);
}

.nav-inner {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 0;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-right: 48px;
}

.logo-icon { width: 34px; height: 34px; transition: transform 0.3s var(--ease); }
.logo:hover .logo-icon { transform: rotate(-8deg) scale(1.05); }

.logo-text {
  font-family: var(--font-heading);
  font-size: 21px;
  font-weight: 700;
  color: rgba(255,255,255,0.95);
  letter-spacing: -0.3px;
  transition: color 0.35s;
}
.logo-text em { font-style: italic; color: var(--forest-400); transition: color 0.35s; }

.scrolled .logo-text { color: var(--forest-900); }
.scrolled .logo-text em { color: var(--forest-600); }

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.nav-links a {
  font-size: 14.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
  padding: 7px 13px;
  border-radius: 8px;
  transition: all 0.2s;
}
.nav-links a:hover { color: white; background: rgba(255,255,255,0.1); }

.scrolled .nav-links a { color: var(--gray-500); }
.scrolled .nav-links a:hover { color: var(--forest-700); background: var(--forest-50); }

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.btn-ghost {
  font-size: 14.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  padding: 8px 16px;
  border-radius: 9px;
  transition: all 0.2s;
}
.btn-ghost:hover { color: white; background: rgba(255,255,255,0.1); }
.scrolled .btn-ghost { color: var(--gray-600); }
.scrolled .btn-ghost:hover { background: var(--forest-50); color: var(--forest-700); }

.logout-btn {
  background: none;
  border: none;
  font-family: inherit;
}

.msg-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  color: rgba(255,255,255,0.85);
  transition: all 0.2s;
}

.msg-btn:hover { background: rgba(255,255,255,0.1); color: white; }
.scrolled .msg-btn { color: var(--gray-600); }
.scrolled .msg-btn:hover { background: var(--forest-50); color: var(--forest-700); }

.msg-badge {
  position: absolute;
  top: 2px; right: 2px;
  min-width: 17px;
  height: 17px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

.mobile-messages {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-badge {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 6px;
}

.btn-cta {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 600;
  color: var(--forest-900);
  background: var(--white);
  padding: 9px 18px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.25s var(--ease);
}
.btn-cta:hover { transform: translateY(-1px); box-shadow: 0 5px 20px rgba(0,0,0,0.22); }
.scrolled .btn-cta { background: var(--forest-600); color: white; }
.scrolled .btn-cta:hover { background: var(--forest-700); }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: auto;
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: white; border-radius: 2px;
  transition: all 0.3s var(--ease);
  transform-origin: center;
}
.scrolled .hamburger span { background: var(--forest-800); }
.hamburger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile drawer */
.mobile-drawer {
  display: none;
  flex-direction: column;
  background: white;
  padding: 12px 20px 20px;
  border-top: 1px solid var(--forest-100);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s var(--ease), padding 0.3s;
}
.mobile-drawer.open { max-height: 500px; }

.mobile-drawer a {
  padding: 11px 14px;
  border-radius: 9px;
  font-size: 15px;
  color: var(--gray-600);
  font-weight: 500;
  transition: all 0.2s;
}
.mobile-drawer a:hover { background: var(--forest-50); color: var(--forest-700); }

.mobile-divider { height: 1px; background: var(--gray-100); margin: 8px 0; }

.mobile-login { font-weight: 500; }
.mobile-login.logout-btn {
  background: none;
  border: none;
  text-align: left;
  width: 100%;
}
.mobile-cta {
  background: var(--forest-600) !important;
  color: white !important;
  text-align: center;
  font-weight: 600 !important;
  margin-top: 4px;
}
.mobile-cta:hover { background: var(--forest-700) !important; }

@media (max-width: 960px) {
  .nav-links { display: none; }
  .nav-actions { display: none; }
  .hamburger { display: flex; }
  .mobile-drawer { display: flex; }
  .logo { margin-right: 0; }
}
</style>
