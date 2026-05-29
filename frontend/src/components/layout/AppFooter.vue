<script setup>
const links = {
  'Marketplace': ['Toutes les annonces', 'Catégories', 'Annonces récentes', 'Déposer une annonce', 'Recherche avancée'],
  'Services': ['Jardiniers à domicile', 'Cours & ateliers', 'Conseils & expertise', 'Conception de jardins'],
  'Aide': ['Comment ça marche ?', 'FAQ', 'Nous contacter', 'Signaler une annonce', 'Guide du vendeur'],
  'L\'Uni Vert': ['À propos', 'Blog & conseils', 'Presse', 'Mentions légales', 'Politique de confidentialité'],
}
</script>

<template>
  <footer class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand -->
          <div class="footer-brand">
            <a href="/" class="footer-logo">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <path d="M18 3C18 3 6 10 6 21C6 27.6 11.4 33 18 33C24.6 33 30 27.6 30 21C30 10 18 3 18 3Z" fill="#52b788"/>
                <path d="M18 3C18 3 30 10 30 21" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M18 33V17" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M18 20C18 20 14 17 11 18" stroke="rgba(255,255,255,0.5)" stroke-width="1.4" stroke-linecap="round"/>
                <path d="M18 24C18 24 22 21 25 22" stroke="rgba(255,255,255,0.5)" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <span class="footer-logo-text">L'Uni <em>Vert</em></span>
            </a>
            <p class="footer-tagline">
              La marketplace de référence pour tous les passionnés de jardinage en France.
            </p>

            <!-- Trust badges -->
            <div class="trust-badges">
              <div class="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Paiements sécurisés
              </div>
              <div class="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Communauté vérifiée
              </div>
            </div>

            <!-- Social -->
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Pinterest">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.27-1.95 3.27-4.77 0-2.49-1.79-4.23-4.34-4.23-2.96 0-4.69 2.22-4.69 4.51 0 .89.34 1.85.77 2.37.08.1.09.19.07.29l-.29 1.16c-.05.18-.16.22-.37.13-1.39-.65-2.26-2.69-2.26-4.33 0-3.52 2.56-6.76 7.38-6.76 3.87 0 6.88 2.76 6.88 6.44 0 3.84-2.42 6.93-5.77 6.93-1.13 0-2.19-.59-2.55-1.28l-.69 2.59c-.25.96-.93 2.17-1.39 2.9.05.01.1.02.15.02z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Links -->
          <div
            v-for="(items, section) in links"
            :key="section"
            class="footer-col"
          >
            <h4 class="footer-col-title">{{ section }}</h4>
            <ul class="footer-col-links">
              <li v-for="item in items" :key="item">
                <a href="#">{{ item }}</a>
              </li>
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
          <div class="bottom-links">
            <a href="#">Mentions légales</a>
            <a href="#">CGU</a>
            <a href="#">Cookies</a>
          </div>
          <span class="made-with">Fait en France</span>
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
  grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr;
  gap: 40px;
}

/* Brand col */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-logo-text {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  color: white;
}
.footer-logo-text em { font-style: italic; color: var(--forest-400); }

.footer-tagline {
  font-size: 14px;
  color: rgba(255,255,255,0.45);
  line-height: 1.7;
  margin-bottom: 24px;
}

.trust-badges {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 24px;
}
.trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.5);
}
.trust-badge svg { color: var(--forest-400); flex-shrink: 0; }

.footer-social {
  display: flex;
  gap: 10px;
}
.social-link {
  width: 36px; height: 36px;
  border-radius: 9px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
  transition: all 0.22s;
}
.social-link:hover { background: var(--forest-600); border-color: var(--forest-500); color: white; }

/* Link cols */
.footer-col-title {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 18px;
}

.footer-col-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-col-links a {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  transition: color 0.2s;
}
.footer-col-links a:hover { color: var(--forest-300); }

/* Bottom bar */
.footer-bottom { padding: 18px 0; }

.bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.copyright, .made-with {
  font-size: 13px;
  color: rgba(255,255,255,0.3);
}

.bottom-links {
  display: flex;
  gap: 20px;
}
.bottom-links a {
  font-size: 13px;
  color: rgba(255,255,255,0.3);
  transition: color 0.2s;
}
.bottom-links a:hover { color: rgba(255,255,255,0.6); }

@media (max-width: 1100px) { .footer-grid { grid-template-columns: 1.4fr 1fr 1fr 1fr; } }
@media (max-width: 860px)  { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
@media (max-width: 500px)  {
  .footer-grid { grid-template-columns: 1fr; }
  .bottom-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
}
</style>
