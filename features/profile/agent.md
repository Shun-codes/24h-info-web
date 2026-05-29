# Feature : Profile (Profil utilisateur)

Consultation et mise à jour du profil, changement de mot de passe, suppression de compte.

## Backend

Dossier : `backend/src/features/users/`

| Méthode | Route | Auth |
|---|---|---|
| GET | `/api/users/:id` | public |
| PUT | `/api/users/me` | requireAuth + multer.single('avatar') |
| DELETE | `/api/users/me` | requireAuth |
| PUT | `/api/auth/password` | requireAuth |

**Attention** : `GET /api/users/:id` est public mais ne retourne que les champs non sensibles (pas le mot de passe, pas `is_banned`).

**Ordre des routes dans `user.routes.js`** : `/me` doit être déclaré AVANT `/:id` pour ne pas être capturé par le wildcard.

## Frontend

| Fichier | Rôle |
|---|---|
| `frontend/src/views/users/profil.vue` | Page profil (consultation + édition) |
| `frontend/src/api/users.js` | Module API users |

## Base de données

Table `users` — colonnes modifiables par l'utilisateur via `PUT /me` : `email`, `name`, `phone`, `city`, `avatar_url`.

**Non modifiables par l'utilisateur** : `role`, `is_banned`. Ces champs ne sont modifiables que par un administrateur ou modérateur (routes non encore implémentées).

L'update utilise `COALESCE` pour ne modifier que les champs fournis.

## Suppression de compte

`DELETE /api/users/me` supprime l'utilisateur. Les annonces associées sont supprimées en cascade (`listings.user_id → users(id) ON DELETE CASCADE`).
