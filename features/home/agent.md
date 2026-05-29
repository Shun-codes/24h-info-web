# Feature : Home (Page d'accueil)

Page d'accueil publique de la marketplace.

## Frontend uniquement

Pas de backend dédié — consomme `/api/categories` et `/api/listings`.

| Fichier | Rôle |
|---|---|
| `frontend/src/views/home/index.vue` | Vue principale (assemble les sections) |
| `frontend/src/components/home/HeroSection.vue` | Section hero (titre + CTA) |
| `frontend/src/components/home/CategoriesSection.vue` | Grille des catégories |
| `frontend/src/components/home/FeaturedListings.vue` | Annonces mises en avant |
| `frontend/src/components/home/StatsBar.vue` | Statistiques (nb annonces, vendeurs, etc.) |
| `frontend/src/components/home/HowItWorks.vue` | Section "Comment ça marche" |
| `frontend/src/components/home/CtaSection.vue` | Appel à l'action (inscription) |

## Règles

- Pas de store dédié.
- Pas de route protégée — accessible sans connexion.
- Les composants `components/home/` ne contiennent pas de logique métier. Ils reçoivent leurs données en props ou les chargent directement depuis `api/`.
