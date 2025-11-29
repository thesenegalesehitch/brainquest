# Guide de Déploiement - CogniQuest

Ce guide explique comment préparer et déployer l'application CogniQuest en production.

## Prérequis

*   Node.js (v18+)
*   NPM (v9+)
*   Compte Supabase (pour la base de données et l'authentification)

## Configuration de l'Environnement

1.  Créer un fichier `.env` à la racine du projet (basé sur `.env.example`).
2.  Remplir les variables suivantes :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-publique-anon
NODE_ENV=production
```

## Build de Production

Pour compiler l'application pour la production :

```bash
npm run build
```

Cette commande va :
1.  Vérifier les types TypeScript (`tsc -b`).
2.  Compiler les assets avec Vite.
3.  Générer les fichiers statiques dans le dossier `dist/`.

## Déploiement

Le dossier `dist/` contient tout le nécessaire pour le déploiement. Vous pouvez héberger ce dossier sur n'importe quel service de fichiers statiques.

### Vercel (Recommandé)

1.  Installer Vercel CLI : `npm i -g vercel`
2.  Déployer : `vercel`
3.  Pour la production : `vercel --prod`

### Netlify

1.  Installer Netlify CLI : `npm i -g netlify-cli`
2.  Déployer : `netlify deploy`
3.  Pour la production : `netlify deploy --prod`

### Serveur Web Classique (Nginx/Apache)

Copier le contenu de `dist/` vers la racine de votre serveur web.
Assurez-vous de configurer la redirection SPA (toutes les routes doivent rediriger vers `index.html`).

Exemple Nginx :
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Vérification Post-Déploiement

1.  Vérifier que l'application se charge sans erreurs dans la console.
2.  Tester l'inscription et la connexion (vérifie la connexion Supabase).
3.  Vérifier que les assets (images, fonts) se chargent correctement.
