# Feature : Categories (Catégories)

Référentiel statique des catégories de jardinage. Lecture seule en runtime.

## Backend

Dossier : `backend/src/features/categories/`

| Méthode | Route | Auth |
|---|---|---|
| GET | `/api/categories` | public |

Retourne toutes les catégories avec le nombre d'annonces actives (`listing_count`).

## Frontend

Pas de store dédié ni de views propres. Consommé à la demande depuis :
- `frontend/src/views/annonces/index.vue` — filtres de recherche
- `frontend/src/components/home/CategoriesSection.vue` — section de la page d'accueil

## Base de données

Table `categories` — 8 lignes seedées dans `database/schema.sql` (`ON CONFLICT (slug) DO NOTHING`).

| Nom | Slug | Icône |
|---|---|---|
| Plantes d'intérieur | `plantes-interieur` | 🌿 |
| Plantes fleuries | `plantes-fleuries` | 🌸 |
| Graines & Bulbes | `graines-bulbes` | 🌱 |
| Arbres & Arbustes | `arbres-arbustes` | 🌳 |
| Outils & Matériel | `outils-materiel` | 🔧 |
| Services & Conseils | `services-conseils` | 🤝 |
| Cours & Ateliers | `cours-ateliers` | 📚 |
| Mobilier de jardin | `mobilier-jardin` | 🪑 |

Le slug est la valeur passée dans le query param `category` pour filtrer les annonces (`GET /api/listings?category=plantes-fleuries`).

**Ne pas modifier le schema des catégories en runtime** — aucune route d'écriture n'est exposée.
