# L'Uni Vert — Instructions agent

Marketplace de petites annonces de jardinage. Concours 24h de l'info 2026 (Montpellier).

## Architecture physique

```
frontend (Vue 3 :5173)
    ↓  proxy /api et /uploads
backend (Express :3000)
    ↓
PostgreSQL (:5432)
```

Trois containers orchestrés par Docker Compose (`docker-compose.yml`). En développement, le proxy Vite (`vite.config.js`) transfère `/api` et `/uploads` vers le backend — le frontend ne connaît jamais l'URL backend directe.

## Flux de données

```
view → store (Pinia) → api/ module → axios (api/client.js) → Express route → controller → model → pg
```

- Aucune view n'appelle axios directement.
- Aucun controller ne contient de SQL.
- Aucun model ne connaît `req` / `res`.

## Organisation du code

### Frontend (`frontend/src/`)

| Dossier | Contenu |
|---|---|
| `views/home/` | Page d'accueil |
| `views/annonces/` | Liste, détail, dépôt, mes-annonces, favoris |
| `views/auth/` | Connexion, inscription |
| `views/users/` | Profil |
| `components/home/` | Sections de la page d'accueil |
| `components/layout/` | NavBar, AppFooter |
| `stores/` | `auth.js`, `listings.js` (Pinia) |
| `api/` | `client.js` (axios), `auth.js`, `listings.js`, `users.js` |
| `router/` | Configuration Vue Router |

### Backend (`backend/src/`)

| Dossier | Contenu |
|---|---|
| `features/auth/` | Controller + routes auth |
| `features/listings/` | Controller + model + routes annonces + favoris |
| `features/categories/` | Controller + model + routes catégories |
| `features/users/` | Controller + model + routes profil |
| `middleware/` | `auth.middleware.js`, `error.middleware.js`, `upload.middleware.js` |
| `config/` | `database.js` (pool pg) |
| `routes/index.js` | Agrégateur — importe depuis `features/` |

### Documentation features (`features/`)

Un dossier par fonctionnalité avec un `agent.md` décrivant backend + frontend :
`auth/`, `listings/`, `favorites/`, `profile/`, `categories/`, `home/`

## Conventions de langue

| Contexte | Langue |
|---|---|
| Code : identifiants, fonctions, variables, fichiers | **Anglais** |
| UI : labels, messages d'erreur, placeholders | **Français** |
| Commentaires et documentation | **Français** |
| Commits git | **Français** |

Pas de TypeScript — le nommage précis compense l'absence de types.

## Conventions de nommage

- Identifiants JS : `camelCase`
- Fichiers Vue : `kebab-case` (ex: `mes-annonces.vue`, `not-found.vue`)
- Fichiers JS backend : `<domaine>.<type>.js` (ex: `listing.model.js`)
- Colonnes PostgreSQL et query params API : `snake_case`
- `index.vue` pour la vue principale d'un domaine (liste d'annonces = `annonces/index.vue`)

## Stack

**Frontend** : Vue 3 (Composition API `<script setup>`), Pinia, Vue Router 4, Axios, Vite

**Backend** : Node.js, Express 5, pg (SQL brut — pas d'ORM), bcryptjs, jsonwebtoken, multer, helmet, express-rate-limit, morgan, dotenv

**Base de données** : PostgreSQL 16

**Infra** : Docker Compose (3 services), scripts dans `scripts/compose.sh` (compatible Docker et Podman)

## Sécurité en place

- **JWT** : signé avec `JWT_SECRET`, expiration `JWT_EXPIRES_IN` (défaut `7d`), stocké dans `localStorage`, injecté via intercepteur Axios.
- **Middlewares auth** : `requireAuth` (bloque si absent), `optionalAuth` (continue sans erreur), `requireRole(...roles)` (vérifie le rôle depuis DB).
- **Rate limiting** : 20 req/15min sur `/api/auth` (anti-brute-force), 300 req/15min global.
- **Helmet** : headers HTTP sécurisés.
- **CORS** : restreint à `FRONTEND_URL`.
- **Upload** : JPEG/PNG/WebP uniquement, 5 MB max, UUID comme nom de fichier.
- **Ownership** : toute mutation vérifie `WHERE id = $1 AND user_id = $2` en base — pas seulement dans le controller.

## Fonctionnalités

### Implémentées (cahier des charges)
- [x] Inscription et connexion
- [x] Gestion du profil (modification, suppression de compte)
- [x] CRUD annonces (création, édition, suppression, masquage)
- [x] Consultation publique sans connexion
- [x] Recherche et filtrage (titre, description, catégorie, ville, prix)
- [x] Page "mes annonces"
- [x] Favoris (ajout/retrait + page dédiée)

### Partiellement implémentées
- **Reports** : `POST /api/listings/:id/report` fonctionne. Pas encore de route `GET` pour les modérateurs.
- **Messages** : table `messages` existe dans le schéma. Aucune route implémentée.
- **Rôles** : middleware `requireRole` existe. Non branché sur les routes — `isAdmin` et `isModerator` calculés dans le store auth mais non exploités côté backend.

## À ne pas faire

- SQL dans les controllers (appartient aux models)
- Appels axios hors des modules `api/`
- Mutations d'état Pinia hors des stores
- Nouvelles dépendances sans raison claire et documentée
- Logic métier dans les templates Vue
