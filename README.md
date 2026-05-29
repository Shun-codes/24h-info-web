# L'Uni Vert — Petites annonces

**Équipe** : IUT de Lens  
**Application en ligne** : [https://24h-info-web-orcin.vercel.app/](https://24h-info-web-orcin.vercel.app/)

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) + Docker Compose

---

## Lancer le projet en local

### 1. Installer les dépendances

```bash
npm run install:all
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

### 3. Arrêter l'application

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

| Rôle | Email | Mot de passe |
|---|---|---|
| Utilisateur | — | — |
| Modérateur | — | — |
| Administrateur | — | — |
