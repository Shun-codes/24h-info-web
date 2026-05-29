<script setup>
import { useAuthStore } from '@/stores/auth.js'
const auth = useAuthStore()
</script>

<template>
  <footer class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">

          <!-- Brand -->
          <div class="footer-brand">
            <RouterLink to="/" class="footer-logo">
              <img src="/uniVert.png" class="footer-logo-img" alt="L'Uni Vert" />
            </RouterLink>
            <p class="footer-tagline">
              La marketplace de référence pour tous les passionnés de jardinage en France.
            </p>

            <div class="trust-badges">
              <div class="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Échanges entre particuliers vérifiés
              </div>
              <div class="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Communauté locale & gratuite
              </div>
            </div>

          </div>

          <!-- Marketplace -->
          <div class="footer-col">
            <h4 class="footer-col-title">Marketplace</h4>
            <ul class="footer-col-links">
              <li><RouterLink to="/annonces">Toutes les annonces</RouterLink></li>
              <li><RouterLink to="/deposer">Déposer une annonce</RouterLink></li>
              <li><RouterLink to="/comment-ca-marche">Comment ça marche</RouterLink></li>
            </ul>
          </div>

          <!-- Mon compte -->
          <div class="footer-col">
            <h4 class="footer-col-title">Mon compte</h4>
            <ul class="footer-col-links">
              <template v-if="auth.isAuthenticated">
                <li><RouterLink to="/profil">Mon profil</RouterLink></li>
                <li><RouterLink to="/mes-annonces">Mes annonces</RouterLink></li>
                <li><RouterLink to="/favoris">Mes favoris</RouterLink></li>
                <li><RouterLink to="/messages">Messages</RouterLink></li>
              </template>
              <template v-else>
                <li><RouterLink to="/connexion">Se connecter</RouterLink></li>
                <li><RouterLink to="/inscription">Créer un compte</RouterLink></li>
              </template>
            </ul>
          </div>

        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="container">
        <div class="bottom-inner">
          <span class="copyright">© 2025 L'Uni Vert — Tous droits réservés</span>
          <span class="made-with">Fait avec passion 🌿 en France</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--forest-900);
  color: rgba(255,255,255,0.6);
}

.footer-main {
  padding: 72px 0 56px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr;
  gap: 48px;
}

/* Brand */
.footer-logo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 18px;
  text-decoration: none;
}
.footer-logo-img {
  height: 40px; width: auto;
  object-fit: contain; display: block;
  transition: opacity 0.2s;
}
.footer-logo:hover .footer-logo-img { opacity: 0.82; }

.footer-tagline {
  font-size: 14px;
  color: rgba(255,255,255,0.42);
  line-height: 1.75;
  margin-bottom: 24px;
  max-width: 300px;
}

.trust-badges {
  display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;
}
.trust-badge {
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; color: rgba(255,255,255,0.48);
}
.trust-badge svg { color: var(--forest-400); flex-shrink: 0; }


/* Link cols */
.footer-col-title {
  font-family: var(--font-body);
  font-size: 11.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 20px;
}
.footer-col-links {
  list-style: none; display: flex; flex-direction: column; gap: 11px;
}
.footer-col-links a {
  font-size: 14px; color: rgba(255,255,255,0.55); transition: color 0.2s;
  text-decoration: none;
}
.footer-col-links a:hover { color: var(--forest-300); }

/* Bottom */
.footer-bottom { padding: 18px 0; }
.bottom-inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
}
.copyright, .made-with {
  font-size: 13px; color: rgba(255,255,255,0.28);
}

@media (max-width: 860px)  { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
@media (max-width: 500px)  {
  .footer-grid { grid-template-columns: 1fr; }
  .bottom-inner { flex-direction: column; align-items: flex-start; gap: 6px; }
}
</style>
