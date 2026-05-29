# Agent Instructions

## Rôle
Tu travailles sur une application web de petites annonces inspirée de Leboncoin / eBay.

Ta priorité n'est pas d'empiler des fonctionnalités, mais de produire un code lisible, testable, simple à faire évoluer et facile à corriger.

## Objectif produit
L'application doit couvrir en priorité le cahier des charges initial:

- inscription et connexion
- gestion du profil utilisateur
- création, édition, suppression et masquage d'annonces
- consultation publique des annonces
- recherche et filtrage d'annonces sans connexion
- page dédiée pour gérer ses propres annonces
- mise en favori des annonces pour un utilisateur connecté

Les évolutions sont autorisées, mais uniquement si elles restent stables, utiles et bien intégrées.

## Principes de maintenabilité

- Privilégie une architecture simple et explicite avant toute sophistication.
- Sépare clairement les responsabilités: UI, logique métier, accès aux données, validation, utilitaires.
- N'implémente pas de logique métier directement dans les composants si elle peut être isolée dans un module dédié.
- Préfère de petits composants/composables/fonctions spécialisés plutôt qu'un gros bloc difficile à relire.
- Réduis les effets de bord et centralise les mutations d'état.
- Donne des noms précis aux variables, fonctions, composants et fichiers.
- Supprime le code mort, les abstractions prématurées et les duplications.
- Si une fonctionnalité est complexe, découpe-la en étapes simples et vérifiables.

## Règles de code

- Garde un style cohérent avec le projet existant.
- Écris du code prévisible, sans magie inutile.
- Documente seulement ce qui n'est pas évident: les intentions, les invariants, les contraintes.
- Évite les commentaires qui répètent le code.
- Si une règle métier peut être validée, mets la validation au plus près de la source de donnée.
- En cas de choix de structure, préfère la clarté et la robustesse à l'optimisation prématurée.

## Architecture recommandée

- Si le projet grandit, sépare le client web et l'API.
- Préfère une API réutilisable plutôt qu'un rendu serveur couplé à la logique métier.
- Structure les données autour des objets métier du domaine: utilisateurs, annonces, catégories, favoris, messages, modération.
- Prépare le projet pour des évolutions futures sans rendre la base inutilement complexe.

## Fonctionnalités prioritaires

- Authentification sûre et simple à maintenir.
- Gestion du profil et des permissions.
- Publication d'annonces avec titre, description, photos, prix, localisation, catégories et moyen de contact.
- Edition, suppression et masquage par le propriétaire.
- Recherche publique efficace et claire.
- Favoris pour les utilisateurs connectés.

## Sécurité

- Vérifie les droits d'accès sur chaque action sensible.
- Ne fais jamais confiance au client pour décider d'une autorisation.
- Protège les actions de modification et de suppression.
- Traite correctement les données utilisateur: validation, nettoyage, limitation des entrées.
- Si une API est ajoutée, fais attention au stockage et à l'échange des tokens.
- Prends en compte le rate limiting et les protections contre les abus.

## Qualité attendue

- Avant d'ajouter une nouvelle fonctionnalité, vérifie qu'elle n'abîme pas les usages existants.
- Favorise des modifications petites et ciblées.
- Quand une fonctionnalité touche plusieurs zones du code, garde un fil directeur clair et vérifiable.
- Assure-toi que le code reste simple à relire pour un autre développeur.

## Design et ergonomie

- L'interface doit rester lisible, cohérente et agréable à utiliser.
- Mets l'accent sur les parcours clés: recherche, consultation, dépôt d'annonce, gestion du compte.
- Évite les écrans surchargés et les interactions ambiguës.

## Déploiement et rendu

- Le site doit être accessible via une URL publique.
- Si une API est présente, elle doit aussi être déployée et documentée.
- Prévois les éléments utiles au rendu: lien de l'application, technologies utilisées, comptes de test, liste des fonctionnalités, mesures de sécurité.
- Si docker ou CI/CD existent, ils doivent rester cohérents avec le projet et être maintenables.

## Choix techniques

- Le projet actuel repose sur Vue 3 et Vite. Conserve cette base tant qu'elle reste adaptée.
- N'introduis pas de dépendance supplémentaire sans raison claire.
- Si une bibliothèque externe est utilisée, justifie son apport par un vrai gain de lisibilité, de fiabilité ou de maintenance.

## Méthode de travail

- Commence par identifier le besoin métier exact.
- Implémente la plus petite tranche utile.
- Vérifie le comportement après chaque changement important.
- Si une règle du cahier des charges est ambiguë, choisis une solution simple, documentée et cohérente avec l'ensemble du projet.

## Priorité finale

La meilleure solution n'est pas celle qui fait le plus de choses, mais celle qui tient bien dans le temps, qui se comprend vite, et qui peut être améliorée sans casse.