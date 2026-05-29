# Feature : Listings (Annonces)

Création, édition, suppression, masquage, consultation, recherche et filtrage d'annonces. Inclut le toggle-favorite côté backend.

## Backend

Dossier : `backend/src/features/listings/`

| Méthode | Route | Auth |
|---|---|---|
| GET | `/api/listings` | optionalAuth |
| POST | `/api/listings` | requireAuth + multer |
| GET | `/api/listings/mine` | requireAuth |
| GET | `/api/listings/favorites` | requireAuth |
| GET | `/api/listings/:id` | optionalAuth |
| PUT | `/api/listings/:id` | requireAuth |
| DELETE | `/api/listings/:id` | requireAuth |
| POST | `/api/listings/:id/favorite` | requireAuth |
| POST | `/api/listings/:id/report` | requireAuth |

**Règles absolues sur les requêtes publiques** :
- `is_hidden = false` obligatoire dans toute requête publique.
- `expires_at > NOW()` obligatoire dans toute requête publique.

**Ownership** : toute mutation inclut `WHERE id = $1 AND user_id = $2` — vérification en base, pas seulement dans le controller.

**WHERE dynamique** (`findAll`) : conditions[] + params[] + `$i` incrémental. Ne jamais interpoler l'input utilisateur.

## Frontend

| Fichier | Rôle |
|---|---|
| `frontend/src/views/annonces/index.vue` | Liste + filtres de recherche |
| `frontend/src/views/annonces/detail.vue` | Détail d'une annonce |
| `frontend/src/views/annonces/deposer.vue` | Création d'annonce |
| `frontend/src/views/annonces/mes-annonces.vue` | Annonces de l'utilisateur connecté |
| `frontend/src/stores/listings.js` | Store Pinia listings + favorites |
| `frontend/src/api/listings.js` | Module API listings |

**State du store** : `listings[]`, `listing`, `favorites[]`, `loading`, `error`.

## Base de données

Tables : `listings`, `listing_images`.

- `listings.expires_at` : défaut `NOW() + 90 days`. Toujours inclus dans les requêtes publiques.
- `listing_images` : liée par `listing_id ON DELETE CASCADE`. URLs sous forme `/uploads/<uuid.ext>`.
- Pattern images dans les requêtes : `COALESCE(json_agg(li.url ORDER BY li.position) FILTER (WHERE li.url IS NOT NULL), '[]')`.

## Upload

- multer diskStorage, répertoire `uploads/`.
- UUID comme nom de fichier.
- Filtre : JPEG, PNG, WebP uniquement.
- Limite : 5 MB par fichier, max 5 images par annonce.
