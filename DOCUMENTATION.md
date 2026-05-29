# L'Uni Vert — Documentation technique complète

> Application de petites annonces en ligne développée pour les 24h de l'Info 2026.  
> Équipe : IUT de Lens

---

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Architecture](#2-architecture)
3. [Base de données](#3-base-de-données)
4. [API REST — Backend](#4-api-rest--backend)
5. [Frontend — Vue 3 SPA](#5-frontend--vue-3-spa)
6. [Sécurité](#6-sécurité)
7. [Infrastructure & déploiement](#7-infrastructure--déploiement)
8. [Guide de démarrage rapide](#8-guide-de-démarrage-rapide)

---

## 1. Vue d'ensemble du projet

**L'Uni Vert** est une place de marché en ligne dédiée aux plantes, graines, outils de jardinage et services associés. Les utilisateurs peuvent publier des annonces, les parcourir sans connexion, contacter les vendeurs par messagerie interne, et mettre des annonces en favori.

### Fonctionnalités implémentées

| Fonctionnalité | Détail |
|---|---|
| Authentification | Inscription / connexion avec JWT, changement de mot de passe |
| Gestion du profil | Modification des infos, avatar, suppression de compte |
| Annonces | Création (titre, description, photos, prix, ville, catégorie, contact), édition, masquage, suppression |
| Recherche & filtres | Texte libre, catégorie, ville, fourchette de prix, favoris uniquement |
| Favoris | Ajout/retrait, page dédiée |
| Messagerie | Envoi de messages liés à une annonce, liste des conversations, fil de discussion |
| Signalement | Signalement d'annonces avec motif |
| Rôles | `user`, `moderator`, `admin` avec middleware `requireRole` |
| Expiration | Les annonces expirent automatiquement après 90 jours |
| Pagination | Côté serveur, 12 annonces par page |

---

## 2. Architecture

```
┌──────────────────────────────────┐
│  Frontend  (Vue 3 SPA)           │  :5173  (dev) / nginx (prod)
│  Vue Router · Pinia · Axios      │
└──────────────┬───────────────────┘
               │ /api  et  /uploads  (proxy Vite en dev, nginx en prod)
┌──────────────▼───────────────────┐
│  Backend  (Express 5 REST API)   │  :3000
│  JWT · multer · helmet · pg      │
└──────────────┬───────────────────┘
               │ pool pg (max 10 connexions)
┌──────────────▼───────────────────┐
│  PostgreSQL 16                   │  :5432
└──────────────────────────────────┘
```

Le frontend est une **SPA pure** qui ne connaît pas l'URL backend directe en production. En développement, Vite proxy `/api` et `/uploads` vers le backend. En production, nginx remplit ce rôle.

### Structure des dossiers

```
/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Point d'entrée Express, middlewares globaux
│   │   ├── config/
│   │   │   └── database.js         # Pool pg partagé
│   │   ├── features/               # Une feature = controller + model + routes
│   │   │   ├── auth/
│   │   │   ├── listings/
│   │   │   ├── categories/
│   │   │   ├── users/
│   │   │   └── messages/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # requireAuth, optionalAuth, requireRole
│   │   │   ├── error.middleware.js  # notFound + errorHandler global
│   │   │   └── upload.middleware.js # Multer (images)
│   │   └── routes/
│   │       └── index.js            # Agrégateur de routes → /api/*
│   └── database/
│       ├── schema.sql              # DDL complet (idempotent via IF NOT EXISTS)
│       └── seed.js                 # Données de test (100 annonces, 3 comptes)
├── frontend/
│   └── src/
│       ├── api/                    # Fonctions Axios par domaine
│       │   ├── client.js           # Instance Axios + intercepteurs
│       │   ├── auth.js
│       │   ├── listings.js
│       │   ├── categories.js
│       │   ├── messages.js
│       │   └── users.js
│       ├── stores/                 # Pinia
│       │   ├── auth.js             # Session utilisateur
│       │   └── listings.js         # Cache annonces / favoris
│       ├── views/                  # Pages (chargement paresseux)
│       │   ├── home/index.vue
│       │   ├── annonces/           # index, detail, deposer, mes-annonces, favoris
│       │   ├── auth/               # connexion, inscription
│       │   ├── users/profil.vue
│       │   └── messages/index.vue
│       ├── components/
│       │   ├── home/               # HeroSection, FeaturedListings, etc.
│       │   └── layout/             # NavBar, AppFooter
│       ├── composables/
│       │   └── useScrollParallax.js
│       └── router/index.js         # Routes + garde d'auth
├── docker-compose.yml
├── docker-compose.prod.yml
└── features/                       # Documentation agents IA par domaine
```

---

## 3. Base de données

### Schéma

#### Table `users`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | SERIAL | PK | Identifiant auto |
| `email` | VARCHAR(255) | UNIQUE NOT NULL | Email de connexion |
| `password` | VARCHAR(255) | NOT NULL | Hash bcrypt |
| `name` | VARCHAR(100) | NOT NULL | Nom affiché |
| `phone` | VARCHAR(20) | | Téléphone (optionnel) |
| `city` | VARCHAR(100) | | Ville |
| `avatar_url` | TEXT | | Chemin `/uploads/uuid.ext` |
| `role` | VARCHAR(20) | CHECK `user\|moderator\|admin` | Rôle, défaut `user` |
| `is_banned` | BOOLEAN | DEFAULT false | Compte suspendu |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

#### Table `listings`

| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| `id` | SERIAL | PK | |
| `user_id` | INTEGER | FK → users (CASCADE) | Propriétaire |
| `category_id` | INTEGER | FK → categories (SET NULL) | Catégorie |
| `title` | VARCHAR(255) | NOT NULL | Titre de l'annonce |
| `description` | TEXT | | Corps de l'annonce |
| `price` | DECIMAL(10,2) | CHECK ≥ 0 | Prix en euros |
| `city` | VARCHAR(100) | | Localisation |
| `contact_method` | VARCHAR(20) | CHECK `message\|phone\|both` | Mode de contact |
| `is_hidden` | BOOLEAN | DEFAULT false | Annonce masquée |
| `expires_at` | TIMESTAMPTZ | DEFAULT NOW()+90j | Expiration automatique |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

#### Table `listing_images`

| Colonne | Type | Description |
|---|---|---|
| `id` | SERIAL PK | |
| `listing_id` | FK → listings (CASCADE) | |
| `url` | TEXT NOT NULL | Chemin `/uploads/uuid.ext` |
| `position` | SMALLINT DEFAULT 0 | Ordre d'affichage |

#### Table `favorites`

| Colonne | Type | Description |
|---|---|---|
| `user_id` | FK → users (CASCADE) | PK composite |
| `listing_id` | FK → listings (CASCADE) | PK composite |
| `created_at` | TIMESTAMPTZ | Date d'ajout |

#### Table `messages`

| Colonne | Type | Description |
|---|---|---|
| `id` | SERIAL PK | |
| `listing_id` | FK → listings (CASCADE) | Annonce concernée |
| `sender_id` | FK → users (CASCADE) | Expéditeur |
| `receiver_id` | FK → users (CASCADE) | Destinataire |
| `content` | TEXT NOT NULL | Corps du message |
| `is_read` | BOOLEAN DEFAULT false | Lu par le destinataire |
| `created_at` | TIMESTAMPTZ | |

#### Table `reports`

| Colonne | Type | Description |
|---|---|---|
| `id` | SERIAL PK | |
| `listing_id` | FK → listings (CASCADE) | Annonce signalée |
| `reporter_id` | FK → users (SET NULL) | Auteur du signalement |
| `reason` | VARCHAR(100) NOT NULL | Motif |
| `description` | TEXT | Détail |
| `status` | VARCHAR(20) CHECK `pending\|resolved\|dismissed` | Statut modération |
| `created_at` | TIMESTAMPTZ | |

#### Index

```sql
idx_listings_user_id      listings(user_id)
idx_listings_category_id  listings(category_id)
idx_listings_city         listings(city)
idx_listings_expires_at   listings(expires_at)
idx_listings_created_at   listings(created_at DESC)
idx_messages_listing_id   messages(listing_id)
idx_messages_receiver_id  messages(receiver_id)
idx_reports_status        reports(status)
```

### Catégories prédéfinies

| Nom | Slug |
|---|---|
| Plantes d'intérieur | `plantes-interieur` |
| Plantes fleuries | `plantes-fleuries` |
| Graines / Bulbes | `graines-bulbes` |
| Arbres / Arbustes | `arbres-arbustes` |
| Outils / Matériel | `outils-materiel` |
| Services / Conseils | `services-conseils` |
| Cours / Ateliers | `cours-ateliers` |
| Mobilier de jardin | `mobilier-jardin` |
| Autres | `autres` |

---

## 4. API REST — Backend

**Base URL** : `http://localhost:3000/api`  
**Format** : JSON (Content-Type: application/json)  
**Authentification** : Bearer token JWT dans l'en-tête `Authorization`

### 4.1 Auth — `/api/auth`

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| POST | `/register` | Non | Crée un compte, retourne `{ token, user }` |
| POST | `/login` | Non | Connexion, retourne `{ token, user }` |
| GET | `/me` | Oui | Profil de l'utilisateur connecté |
| PUT | `/password` | Oui | Changement de mot de passe |

**POST /register**
```json
// Corps
{ "email": "...", "password": "...", "name": "...", "phone": "...", "city": "..." }

// Réponse 201
{ "token": "eyJ...", "user": { "id": 1, "email": "...", "name": "...", "role": "user" } }
```

**POST /login**
```json
// Corps
{ "email": "...", "password": "..." }

// Réponse 200
{ "token": "eyJ...", "user": { "id": 1, "email": "...", "name": "...", "role": "user" } }
```

**PUT /password**
```json
// Corps
{ "currentPassword": "...", "newPassword": "..." }
```

---

### 4.2 Annonces — `/api/listings`

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| GET | `/` | Optionnelle | Liste paginée avec filtres |
| POST | `/` | Oui | Crée une annonce (multipart/form-data) |
| GET | `/mine` | Oui | Annonces de l'utilisateur connecté |
| GET | `/favorites` | Oui | Annonces favorites |
| GET | `/:id` | Optionnelle | Détail d'une annonce |
| PUT | `/:id` | Oui | Modifie une annonce (propriétaire) |
| DELETE | `/:id` | Oui | Supprime une annonce (propriétaire) |
| POST | `/:id/favorite` | Oui | Bascule favori |
| POST | `/:id/report` | Oui | Signale une annonce |

**GET / — Paramètres de requête**

| Paramètre | Type | Description |
|---|---|---|
| `search` | string | Recherche dans titre et description (ILIKE) |
| `category` | string | Slug de catégorie |
| `city` | string | Ville (recherche partielle) |
| `min_price` | number | Prix minimum |
| `max_price` | number | Prix maximum |
| `limit` | number | Résultats par page (défaut 20, max 100) |
| `offset` | number | Décalage pour la pagination |

**Réponse GET /**
```json
[
  {
    "id": 1,
    "title": "Monstera deliciosa",
    "price": "15.00",
    "city": "Lyon",
    "created_at": "2026-05-01T...",
    "is_hidden": false,
    "seller_id": 3,
    "seller_name": "Alice",
    "category_name": "Plantes d'intérieur",
    "category_slug": "plantes-interieur",
    "thumbnail": "/uploads/uuid.png"
  }
]
```

**Réponse GET /:id (détail)**
```json
{
  "id": 1,
  "title": "Monstera deliciosa",
  "description": "Très belle plante...",
  "price": "15.00",
  "city": "Lyon",
  "contact_method": "message",
  "is_hidden": false,
  "expires_at": "2026-08-01T...",
  "seller_id": 3,
  "seller_name": "Alice",
  "seller_phone": "06...",
  "seller_avatar": "/uploads/uuid.jpg",
  "seller_city": "Lyon",
  "category_name": "Plantes d'intérieur",
  "category_slug": "plantes-interieur",
  "images": ["/uploads/uuid1.png", "/uploads/uuid2.png"],
  "is_favorited": false
}
```

**POST / — Création d'annonce (multipart/form-data)**
```
title        : string (requis)
price        : number (requis)
city         : string (requis)
description  : string
category_id  : number
contact_method: "message" | "phone" | "both"
images       : fichier(s) — max 5, JPEG/PNG/WebP, 5 Mo chacun
```

**POST /:id/favorite**
```json
// Réponse
{ "favorited": true }   // ou false si retiré
```

**POST /:id/report**
```json
// Corps
{ "reason": "spam", "description": "..." }
```

---

### 4.3 Utilisateurs — `/api/users`

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| GET | `/:id` | Non | Profil public d'un utilisateur |
| PUT | `/me` | Oui | Modifie le profil (multipart/form-data) |
| DELETE | `/me` | Oui | Supprime le compte |

**PUT /me — multipart/form-data**
```
email    : string (requis)
name     : string (requis)
phone    : string
city     : string
avatar   : fichier image (optionnel)
```

---

### 4.4 Catégories — `/api/categories`

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| GET | `/` | Non | Liste toutes les catégories |

```json
[{ "id": 1, "name": "Plantes d'intérieur", "slug": "plantes-interieur", "icon": null }]
```

---

### 4.5 Messages — `/api/messages`

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| POST | `/` | Oui | Envoie un message |
| GET | `/conversations` | Oui | Liste les conversations (une par (annonce, interlocuteur)) |
| GET | `/thread/:listingId` | Oui | Fil de discussion pour une annonce |
| PUT | `/:id/read` | Oui | Marque un message comme lu |
| GET | `/unread-count` | Oui | Nombre de messages non lus |

**POST /**
```json
// Corps
{ "listing_id": 1, "content": "Bonjour, est-ce disponible ?", "receiver_id": 3 }
// receiver_id est optionnel — défaut : propriétaire de l'annonce
```

**GET /conversations**
```json
[
  {
    "id": 42,
    "listing_id": 1,
    "listing_title": "Monstera deliciosa",
    "content": "Dernier message...",
    "is_read": false,
    "created_at": "...",
    "other_user_id": 5,
    "other_user_name": "Bob",
    "other_user_avatar": null
  }
]
```

---

### 4.6 Santé — `/api/health`

```json
// GET /api/health
{ "status": "ok", "service": "L'Uni Vert API" }
```

---

### Codes d'erreur communs

| Code | Signification |
|---|---|
| 400 | Paramètre manquant ou invalide |
| 401 | Token absent, expiré ou invalide |
| 403 | Compte banni ou rôle insuffisant |
| 404 | Ressource introuvable |
| 409 | Conflit (email déjà utilisé, favori déjà ajouté) |
| 413 | Fichier trop volumineux |
| 429 | Trop de requêtes (rate limit) |
| 500 | Erreur interne serveur |

---

## 5. Frontend — Vue 3 SPA

### 5.1 Routes

| Chemin | Nom | Auth requise | Description |
|---|---|---|---|
| `/` | `home` | Non | Page d'accueil |
| `/annonces` | `listings` | Non | Liste des annonces + filtres |
| `/annonces/:id` | `listing` | Non | Détail d'une annonce |
| `/connexion` | `login` | Non | Formulaire de connexion |
| `/inscription` | `register` | Non | Formulaire d'inscription |
| `/deposer` | `create-listing` | Oui | Formulaire de création d'annonce |
| `/mes-annonces` | `my-listings` | Oui | Gestion de ses annonces |
| `/favoris` | `favorites` | Oui | Annonces favorites |
| `/profil` | `profile` | Oui | Édition du profil |
| `/messages` | `messages` | Oui | Messagerie |
| `/comment-ca-marche` | `how-it-works` | Non | Page explicative |
| `/:pathMatch(.*)` | `not-found` | Non | Page 404 |

La garde de navigation vérifie `meta.requiresAuth` et redirige vers `/connexion` si l'utilisateur n'est pas authentifié.

Toutes les routes protégées sont chargées en **lazy loading** (`() => import(...)`) pour réduire le bundle initial.

### 5.2 Stores Pinia

#### `useAuthStore`

| État | Type | Description |
|---|---|---|
| `user` | `Ref<User\|null>` | Profil utilisateur courant |
| `token` | `Ref<string\|null>` | JWT stocké en localStorage |
| `isAuthenticated` | `ComputedRef<boolean>` | `!!token` |
| `isAdmin` | `ComputedRef<boolean>` | `role === 'admin'` |
| `isModerator` | `ComputedRef<boolean>` | `role ∈ {admin, moderator}` |

| Action | Description |
|---|---|
| `login(credentials)` | Appelle l'API, persiste token + user |
| `register(userData)` | Idem après inscription |
| `refreshUser()` | Re-fetch le profil depuis `/api/auth/me` |
| `logout()` | Vide le store et localStorage |
| `setUser(nextUser)` | Met à jour le user sans requête réseau |

#### `useListingsStore`

| État | Description |
|---|---|
| `listings` | Liste courante d'annonces |
| `listing` | Annonce en cours de consultation |
| `favorites` | Annonces favorites |
| `loading` | Indicateur de chargement |
| `error` | Message d'erreur |

| Action | Description |
|---|---|
| `fetchListings(params)` | Charge la liste avec filtres |
| `fetchListing(id)` | Charge le détail d'une annonce |
| `fetchFavorites()` | Charge les favoris |
| `toggleFavorite(id)` | Bascule favori, met à jour l'état local |

### 5.3 Composable `useScrollParallax`

Fournit deux utilitaires pour l'effet de parallaxe sur les décorations végétales :

- **`useScrollParallax()`** : retourne un `Ref<number>` qui suit `window.scrollY` via un listener passif.
- **`parallaxStyle(sectionRef, sy, speed)`** : retourne un `ComputedRef` de style CSS `transform: translate3d(0, Xpx, 0)`. La position est calculée depuis `getBoundingClientRect().top` (relative au viewport), et `sy` est intégré dans la formule pour déclencher la réactivité Vue.

### 5.4 Client Axios (`src/api/client.js`)

L'instance Axios centrale configure deux intercepteurs :

**Requête** : injecte le JWT (`Authorization: Bearer …`) depuis localStorage. Pour les requêtes `FormData` (upload), supprime `Content-Type` pour laisser le navigateur définir le boundary multipart.

**Réponse** : sur une erreur 401, efface localStorage et redirige vers `/connexion` via `window.location.href` (réinitialise l'état de l'app sans boucle Vue Router).

### 5.5 Page d'annonces (`/annonces`)

La page implémente un système de filtres réactifs avec deux vitesses de déclenchement :

- **Sélect & checkbox** (catégorie, favoris) → application immédiate via `watch`
- **Champs texte** (recherche, ville, prix) → debounce 400 ms pour éviter une requête par frappe

L'URL est mise à jour à chaque changement de filtre (`router.replace`) pour permettre le partage de recherches et la navigation arrière.

---

## 6. Sécurité

### Authentification

- **JWT HS256** — signé avec `JWT_SECRET`, durée configurable (`JWT_EXPIRES_IN`, défaut 7 jours)
- **Stockage** : localStorage (pas de cookie — SPA sans backend rendu serveur)
- **Injection** : intercepteur Axios injecte le token dans chaque requête

### Mots de passe

- **bcrypt** avec 12 salt rounds — résistant aux attaques par dictionnaire
- Jamais renvoyés dans les réponses API
- Le message d'erreur de login est volontairement générique pour éviter l'énumération d'emails

### Limitation de débit (Rate Limiting)

- **Routes `/api/auth`** : 20 requêtes / 15 min (anti-brute-force)
- **Global** : 300 requêtes / 15 min

### En-têtes HTTP

- **Helmet** : CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy

### CORS

- Restreint à `FRONTEND_URL` (variable d'environnement)
- `credentials: true` pour les cookies (non utilisés actuellement mais prêts)

### Upload de fichiers

- MIME types autorisés : `image/jpeg`, `image/png`, `image/webp`
- Taille max : 5 Mo par fichier
- Nom de fichier : UUID (pas d'exposition du nom original, pas de path traversal)

### Propriété des ressources

- Les mutations d'annonces incluent `AND user_id = $n` dans la requête SQL — impossible de modifier l'annonce d'un autre utilisateur sans accès direct à la base

### Comptes bannis

- Vérification `is_banned` à la connexion — le token est refusé avant génération

---

## 7. Infrastructure & déploiement

### Docker Compose (développement)

```yaml
# docker-compose.yml
services:
  postgres: image postgres:16
  backend:  build ./backend, port 3000
  frontend: build ./frontend, port 5173 (Vite dev server)
```

La base de données est initialisée automatiquement via le schéma SQL au premier démarrage.

### Docker Compose (production)

```yaml
# docker-compose.prod.yml
services:
  postgres: image postgres:16
  backend:  Dockerfile.prod (Node.js production)
  frontend: Dockerfile.prod (Vite build + nginx)
```

En production, le frontend est servi par nginx qui proxy `/api` et `/uploads` vers le backend.

### Variables d'environnement

**Racine (`.env`)**

| Variable | Description | Exemple |
|---|---|---|
| `DB_PASSWORD` | Mot de passe PostgreSQL | `lunivert_dev` |
| `JWT_SECRET` | Clé secrète JWT (min 32 chars) | `changeme_...` |
| `CONTAINER_CLI` | `docker` ou `podman` | `docker` |

**Backend (`backend/.env`)**

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `3000` | Port du serveur Express |
| `DB_HOST` | `localhost` | Hôte PostgreSQL |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_NAME` | `lunivert` | Nom de la base |
| `DB_USER` | `postgres` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | — | Mot de passe (requis) |
| `JWT_SECRET` | — | Clé secrète (requis) |
| `JWT_EXPIRES_IN` | `7d` | Durée de vie du token |
| `FRONTEND_URL` | `http://localhost:5173` | Origine autorisée par CORS |
| `NODE_ENV` | `development` | `production` en prod |

---

## 8. Guide de démarrage rapide

### Prérequis

- Docker + Docker Compose (ou Podman avec `CONTAINER_CLI=podman`)

### Lancer le projet

```bash
# 1. Copier les variables d'environnement
cp .env.example .env

# 2. Démarrer tous les services
npm run start-dev

# 3. (Une fois) Injecter les données de test
npm run db:seed

# 4. Arrêter
npm run stop-dev
```

### URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Health check | http://localhost:3000/api/health |

### Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Utilisateur | user@lunivert.fr | User1234 |
| Modérateur | modo@lunivert.fr | Modo1234 |
| Administrateur | admin@lunivert.fr | Admin1234 |

### Commandes utiles

```bash
# Voir les logs en temps réel
npm run docker:logs

# Rebuild complet (après modification d'un Dockerfile)
npm run docker:up

# Reset complet de la base de données
docker compose down -v && npm run start-dev && npm run db:seed

# Lancer les tests
npm run test           # tous les tests
npm run test:backend   # tests backend uniquement
npm run test:frontend  # tests frontend uniquement
```

---

*Documentation générée le 2026-05-29 — L'Uni Vert, IUT de Lens*
