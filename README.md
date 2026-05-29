# L'Uni Vert — Petites annonces

**Équipe** : IUT de Lens  
**Application en ligne** : [https://24h-info-web-orcin.vercel.app/](https://24h-info-web-orcin.vercel.app/)  
**API** : `https://24h-info-web-orcin.vercel.app/api/health`

---

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | Vue 3, Pinia, Vue Router 4, Axios, Vite |
| Backend | Node.js, Express 5, pg (SQL brut), bcryptjs, JWT, multer |
| Sécurité | helmet, express-rate-limit, CORS |
| Base de données | PostgreSQL 16 |
| Infrastructure | Docker Compose, scripts Bash (compatible Podman) |

---

## Architecture

```
┌──────────────────────────────┐
│  Frontend  (Vue 3 SPA)       │  :5173
│  Vue Router · Pinia · Axios  │
└────────────┬─────────────────┘
             │ /api  /uploads (proxy Vite en dev)
┌────────────▼─────────────────┐
│  Backend  (Express REST API) │  :3000
│  JWT · multer · helmet       │
└────────────┬─────────────────┘
             │
┌────────────▼─────────────────┐
│  PostgreSQL 16               │  :5432
└──────────────────────────────┘
```

Le frontend est une SPA pure — il ne connaît pas l'URL backend directe. L'API est indépendante et réutilisable.

---

## Fonctionnalités

### Cahier des charges initial

- [x] Inscription et connexion
- [x] Gestion du profil (modification des informations, suppression de compte)
- [x] Publication d'annonces (titre, description, photos, prix, ville, catégorie, moyen de contact)
- [x] Édition, suppression et masquage d'annonces par le propriétaire
- [x] Page "mes annonces" pour gérer ses publications
- [x] Consultation publique sans connexion
- [x] Recherche et filtrage (titre/description, catégorie, ville, fourchette de prix)
- [x] Mise en favori et page favoris (utilisateur connecté)

### Évolutions ajoutées

- [x] Architecture SPA + API REST séparée (portable sur d'autres clients)
- [x] Rôles utilisateur (user, moderator, admin) avec middleware `requireRole`
- [x] Signalement d'annonces (`POST /api/listings/:id/report`)
- [x] Expiration automatique des annonces (90 jours)
- [x] Comptes de test seedés automatiquement
- [x] Virtualisation Docker Compose avec support Podman

---

## Sécurité

- **Authentification** : JWT signé (HS256), expiration 7 jours, stocké en localStorage, injecté via intercepteur Axios.
- **Rate limiting** : 20 requêtes/15 min sur les routes d'auth (anti-brute-force), 300 requêtes/15 min global.
- **Headers HTTP** : helmet (CSP, HSTS, X-Frame-Options, etc.).
- **CORS** : restreint à `FRONTEND_URL`.
- **Mots de passe** : hashés avec bcrypt (12 salt rounds). Jamais renvoyés dans les réponses.
- **Upload** : JPEG/PNG/WebP uniquement, 5 MB max par fichier, UUID comme nom de fichier (pas d'exposition du nom original).
- **Ownership** : mutations d'annonces vérifiées en base (`WHERE id = $1 AND user_id = $2`) — impossible de modifier l'annonce d'un autre sans accès DB direct.
- **Comptes bannis** : vérification `is_banned` à la connexion — token refusé.

---

## Prérequis

- [Docker](https://www.docker.com/) + Docker Compose (ou Podman via `CONTAINER_CLI=podman`)

---

## Lancer le projet en local

### 1. Copier les variables d'environnement

```bash
cp .env.example .env
```

### 2. Démarrer l'application

```bash
npm run start-dev
```

Cette commande lance automatiquement les trois services via Docker :

| Service | URL |
|---|---|
| Frontend (Vue 3) | http://localhost:5173 |
| Backend (API REST) | http://localhost:3000 |
| Base de données (PostgreSQL) | port 5432 |

> La base de données est initialisée automatiquement au premier démarrage.

### 3. Injecter les comptes de test

```bash
npm run db:seed
```

### 4. Arrêter l'application

```bash
npm run stop-dev
```

---

## Autres commandes utiles

```bash
# Voir les logs en temps réel
npm run docker:logs

# Rebuild complet (après modification du Dockerfile)
npm run docker:up

# Reset complet (supprime aussi la base de données)
docker compose down -v
```

---

## Comptes de test

> Créés automatiquement via `npm run db:seed` (à lancer une fois après le démarrage).

| Rôle | Email | Mot de passe |
|---|---|---|
| Utilisateur | user@lunivert.fr | User1234 |
| Modérateur | modo@lunivert.fr | Modo1234 |
| Administrateur | admin@lunivert.fr | Admin1234 |

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `DB_PASSWORD` | Mot de passe PostgreSQL | `lunivert_dev` |
| `JWT_SECRET` | Clé secrète JWT (min 32 chars) | `change_me_in_production_...` |
| `CONTAINER_CLI` | `docker` ou `podman` | `docker` |

Variables backend (`backend/.env`) :

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port du serveur | `3000` |
| `DB_HOST` | Hôte PostgreSQL | `localhost` |
| `DB_NAME` | Nom de la base | `lunivert` |
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `JWT_EXPIRES_IN` | Durée de validité du token | `7d` |
| `FRONTEND_URL` | URL autorisée par CORS | `http://localhost:5173` |

---

## Structure du projet

```
/
├── features/               (documentation — un agent.md par fonctionnalité)
├── backend/
│   ├── src/
│   │   ├── features/       (auth/, listings/, categories/, users/)
│   │   ├── middleware/     (auth, error, upload)
│   │   ├── routes/         (index.js — agrégateur)
│   │   └── config/         (database.js)
│   └── database/           (schema.sql, seed.js)
├── frontend/
│   └── src/
│       ├── views/          (home/, annonces/, auth/, users/)
│       ├── components/     (home/, layout/)
│       ├── stores/         (auth.js, listings.js)
│       ├── api/            (client.js, auth.js, listings.js, users.js)
│       └── router/
├── scripts/                (compose.sh)
├── docker-compose.yml
└── agent.md                (instructions pour l'agent IA)
```

---

<details>
<summary>Sujet original du concours</summary>

## Sujet

L'objectif de cette épreuve est de proposer une application (site) web de petites annonces en ligne (type Leboncoin, eBay, etc) afin de vendre des objets ou des services. Dans un premier temps, l'application devra remplir un cahier des charges initial puis chaque équipe aura ensuite la liberté d'intégrer diverses fonctionnalités supplémentaires dans le but d'enrichir le projet afin de proposer la meilleure application possible.

### Cahier des charges initial

- On doit pouvoir s'inscrire et se connecter sur l'application.
- Un utilisateur peut gérer son profil (modifier ses informations, supprimer son compte, etc.)
- Les utilisateurs peuvent poster des petites annonces.
- Les petites annonces doivent pouvoir contenir un titre, un descriptif, une ou plusieurs photos (optionnellement), un prix, une localisation (ville, région), une ou plusieurs catégories et un moyen de contacter l'utilisateur à l'origine de l'annonce.
- Le choix du « moyen de contact » d'un utilisateur est laissé à votre appréciation.
- Une petite annonce peut être éditée ou supprimée par l'utilisateur qui l'a postée. Elle peut aussi être masquée par son propriétaire.
- Une page dédiée permet à l'utilisateur de lister et gérer toutes les annonces qu'il a postées.
- On peut rechercher des petites annonces sur le site (sans nécessairement être connecté).
- Il n'y a pas besoin d'être connecté pour rechercher ou visualiser une petite annonce.
- Un utilisateur connecté peut mettre en favori certaines annonces.

</details>
