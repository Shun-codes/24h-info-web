# Feature : Favorites (Favoris)

Mise en favori / retrait d'une annonce et consultation de ses favoris.

## Backend

Pas de dossier dédié — logique dans `backend/src/features/listings/`.

| Méthode | Route | Auth |
|---|---|---|
| POST | `/api/listings/:id/favorite` | requireAuth |
| GET | `/api/listings/favorites` | requireAuth |

Implémentation dans `listing.model.js` : `toggleFavorite(userId, listingId)` et `getFavorites(userId)`.

## Frontend

| Fichier | Rôle |
|---|---|
| `frontend/src/views/annonces/favoris.vue` | Page de consultation des favoris |
| `frontend/src/stores/listings.js` | Actions `fetchFavorites`, `toggleFavorite`, state `favorites[]` |
| `frontend/src/api/listings.js` | Fonctions `getFavorites()`, `toggleFavorite(id)` |

Pas de store ou module API séparé — partagé avec la feature listings.

## Base de données

Table `favorites` :
- PK composite `(user_id, listing_id)`.
- `user_id → users(id) ON DELETE CASCADE`.
- `listing_id → listings(id) ON DELETE CASCADE`.
- `created_at` pour trier les favoris par date d'ajout.

## Navigation

Route `/favoris` — `meta: { requiresAuth: true }` dans `router/index.js`.
