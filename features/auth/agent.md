# Feature : Auth

Inscription, connexion et gestion du token JWT.

## Backend

Dossier : `backend/src/features/auth/`

| Méthode | Route | Auth |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | requireAuth |
| PUT | `/api/auth/password` | requireAuth |

Pas de model propre — utilise `UserModel` depuis `../users/user.model.js`.

Rate limit spécifique : 20 requêtes / 15 min sur `/api/auth` (défini dans `app.js`).

## Frontend

| Fichier | Rôle |
|---|---|
| `frontend/src/views/auth/connexion.vue` | Formulaire de connexion |
| `frontend/src/views/auth/inscription.vue` | Formulaire d'inscription |
| `frontend/src/stores/auth.js` | Store Pinia auth |
| `frontend/src/api/auth.js` | Module API auth |

**State du store** : `user`, `token`, `isAuthenticated`, `isAdmin`, `isModerator`.

## Token JWT

- Stocké dans `localStorage` sous la clé `token`.
- Injecté automatiquement via l'intercepteur request dans `api/client.js` (`Authorization: Bearer <token>`).
- Expiration : valeur de `JWT_EXPIRES_IN` (défaut `7d`).
- Payload : `{ sub: userId }`. Le rôle n'est **pas** dans le payload — `requireRole` fait un `UserModel.findById` si besoin.

## Sécurité

- Mots de passe hashés avec bcrypt (salt rounds : 12).
- Vérification `is_banned` avant de délivrer un token.
- L'intercepteur response dans `api/client.js` redirige vers `/connexion` sur 401.
