
# CogniQuest++ 🧠✨

**Application de brain training ultra-complète, sécurisée et gamifiée basée sur des études scientifiques**

## 🌟 Vue d'ensemble

CogniQuest++ est une application web progressive de brain training conçue pour stimuler et améliorer les capacités cognitives à travers 10 catégories de puzzles scientifiquement validés. L'application combine neurosciences, gamification et sécurité avancée pour offrir une expérience d'apprentissage optimale.

## 🚀 Fonctionnalités principales

### 🎯 Catégories cognitives (10 au total)
1. **Devinettes & Énigmes** - Stimulation de la pensée créative
2. **Casse-têtes visuels** - Rotation spatiale et perception
3. **Raisonnement logique** - Déduction et analyse
4. **Séquences & Motifs** - Reconnaissance de patterns
5. **Mémoire & Attention** - Mémorisation séquentielle
6. **Calcul mental** - Arithmétique rapide
7. **Créativité spatiale** - Puzzles de type Tangram
8. **Intelligence émotionnelle** - Reconnaissance des émotions
9. **Orientation spatiale** - Navigation et labyrinthes
10. **Langage & Fluidité verbale** - Anagrammes et vocabulaire

### 🎮 Système de progression
- **3 niveaux par catégorie** avec 100+ puzzles chacun
- **Système de score** : 90% minimum requis pour débloquer le niveau suivant
- **Système XP** avec courbes de progression dynamiques
- **Badges et achievements** basés sur la performance

### 🛡️ Sécurité anti-triche
- Détection de perte de focus (Alt+Tab)
- Désactivation des outils développeur
- Monitoring des patterns de mouvement souris
- Protection contre copier-coller
- Détection d'inactivité prolongée

### 🎨 Design et UX
- **Thème stellaire** avec dégradés cosmiques
- **Interface responsive** adaptée à tous les écrans
- **Animations fluides** et feedback visuel immédiat
- **Accessibilité** intégrée

## 🏗️ Architecture technique

### Stack technologique
- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + Shadcn/UI
- **Routing** : React Router v6
- **State Management** : React Query (TanStack Query)
- **Animations** : CSS transitions natives
- **Sécurité** : Context API pour l'anti-cheat

### Structure du projet
```
src/
├── components/          # Composants réutilisables
│   ├── puzzles/        # Composants de puzzles
│   │   └── types/      # Types de puzzles spécifiques
│   ├── security/       # Système anti-cheat
│   └── ui/            # Composants UI de base
├── data/              # Données statiques et puzzles
├── pages/             # Pages principales
├── types/             # Définitions TypeScript
└── hooks/             # Hooks personnalisés
```

## 📋 Installation et démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone [repository-url]
cd cogniquest-plus

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build
```

## 🎯 Guide d'utilisation

### Pour les joueurs
1. **Accueil** : Sélectionnez une catégorie cognitive
2. **Niveau** : Choisissez votre niveau (débloquage progressif)
3. **Jeu** : Résolvez les puzzles dans le temps imparti
4. **Résultats** : Consultez vos performances et progressez

### Système de notation
- **< 70%** : Échec - Retry recommandé
- **70-89%** : Bien - Progression possible mais pas de déblocage
- **90-95%** : Excellent - Niveau suivant débloqué
- **95%+** : Parfait - Bonus XP

## 🧪 Base scientifique

### Références académiques
- **Neuroplasticité** : Adaptation basée sur les travaux de Merzenich
- **Zone proximale de développement** : Théorie de Vygotsky
- **Flow state** : Modèle de Csíkszentmihályi
- **Gamification** : Principes de Deterding et al.

### Métriques cognitives
- Temps de réaction
- Précision des réponses
- Patterns d'apprentissage
- Courbes de progression

## 🔒 Sécurité

### Mesures anti-triche
- **Détection comportementale** : Analyse des patterns anormaux
- **Contrôle temporel** : Validation des temps de réponse
- **Monitoring environnemental** : Détection des tentatives de contournement
- **Sanctions graduelles** : Système d'avertissements progressifs

### Protection des données
- Chiffrement des communications
- Validation côté client et serveur
- Protection contre les injections
- Conformité RGPD

## 🎨 Guide de style

### Palette de couleurs
```css
--cosmic-400: #8B5CF6    /* Violet cosmique */
--stellar-400: #06B6D4   /* Cyan stellaire */
--dark: #0F172A          /* Arrière-plan sombre */
--gradient: linear-gradient(135deg, #8B5CF6, #06B6D4)
```

### Composants UI
- **Cards** : Effets de glow et transparence
- **Buttons** : Gradients avec hover effects
- **Progress bars** : Animations fluides
- **Notifications** : Toast système

## 📊 Monitoring et analytics

### Métriques clés
- Temps de session moyen
- Taux de réussite par catégorie
- Progression des utilisateurs
- Détection d'anomalies

### Tableaux de bord
- Performance cognitive individuelle
- Statistiques globales
- Rapports de sécurité
- Métriques d'engagement

## 🚀 Déploiement

### Environnements
- **Développement** : Local avec hot-reload
- **Staging** : Tests et validation
- **Production** : Optimisé et sécurisé

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- Lint et tests automatisés
- Build et optimisation
- Déploiement automatique
- Monitoring post-déploiement
```

## 🤝 Contribution

### Standards de code
- ESLint + Prettier configuration
- Nomenclature consistante
- Documentation inline obligatoire
- Tests unitaires pour les fonctions critiques

### Git workflow
```bash
# Branches principales
main         # Production stable
develop      # Développement actif
feature/*    # Nouvelles fonctionnalités
hotfix/*     # Corrections urgentes
```

## 📝 Changelog

### Version 1.0.0 (Initial Release)
- ✅ 10 catégories cognitives complètes
- ✅ 3000+ puzzles générés
- ✅ Système anti-cheat avancé
- ✅ Interface utilisateur complète
- ✅ Documentation exhaustive

## 📞 Support et contact

### Issues GitHub
- Bug reports avec template
- Feature requests
- Questions techniques

### Documentation
- API Reference
- Architecture Guide
- Security Guide
- Developer Guide

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**CogniQuest++** - *Révolutionnez votre cerveau, une synapse à la fois* 🧠✨
