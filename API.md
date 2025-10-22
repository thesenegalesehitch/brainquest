
# Documentation API CogniQuest++ 🚀

## Vue d'ensemble de l'API

CogniQuest++ utilise une architecture API RESTful avec des endpoints optimisés pour les performances et la sécurité. L'API gère l'authentification, la progression des utilisateurs, les puzzles et les systèmes anti-cheat.

## 🔑 Authentification

### Base URL
```
Production: https://api.cogniquest.app/v1
Staging: https://staging-api.cogniquest.app/v1
Development: http://localhost:3001/v1
```

### Headers requis
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-Client-Version: 1.0.0
X-Device-ID: <unique_device_identifier>
```

## 🧩 Endpoints Puzzles

### GET /puzzles/categories
Récupère toutes les catégories de puzzles disponibles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "riddles",
      "title": "Devinettes & Énigmes",
      "description": "Stimulez votre pensée créative",
      "icon": "lightbulb",
      "levels": 3,
      "totalPuzzles": 100,
      "unlockedLevels": 1,
      "progress": 45.5,
      "cognitiveSkills": ["creativity", "lateral_thinking", "problem_solving"]
    }
  ]
}
```

### GET /puzzles/category/:categoryId/level/:level
Récupère les puzzles d'une catégorie et niveau spécifiques.

**Parameters:**
- `categoryId`: Identifiant de la catégorie
- `level`: Niveau (1-3)

**Query Parameters:**
- `limit`: Nombre de puzzles (défaut: 10)
- `offset`: Décalage pour la pagination
- `shuffle`: Mélanger l'ordre (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "puzzles": [
      {
        "id": "riddle_001",
        "title": "L'énigme du temps",
        "description": "Une énigme classique sur la perception temporelle",
        "type": "riddle",
        "level": 1,
        "difficulty": 3,
        "timeLimit": 60,
        "content": {
          "question": "Je suis toujours devant toi mais tu ne peux jamais me rattraper. Qui suis-je ?",
          "hint": "Pense à quelque chose d'abstrait mais constant"
        },
        "solution": "l'avenir",
        "explanation": "L'avenir est toujours devant nous dans le temps mais nous ne pouvons jamais l'atteindre car il devient présent puis passé.",
        "cognitiveSkills": ["lateral_thinking", "abstract_reasoning"],
        "scientificBasis": "Stimule les connexions neuronales associées à la pensée divergente (Guilford, 1967)"
      }
    ],
    "metadata": {
      "total": 100,
      "level": 1,
      "category": "riddles",
      "averageDifficulty": 3.2,
      "estimatedTime": "15-20 minutes"
    }
  }
}
```

### POST /puzzles/answer
Soumet une réponse à un puzzle.

**Request Body:**
```json
{
  "puzzleId": "riddle_001",
  "answer": "l'avenir",
  "responseTime": 45000,
  "sessionId": "sess_abc123",
  "metadata": {
    "deviceFingerprint": "fp_xyz789",
    "timestamp": 1703090400000,
    "attempts": 1
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "correct": true,
    "score": 95,
    "timeBonus": 10,
    "baseScore": 85,
    "explanation": "Excellente réponse ! L'avenir est effectivement...",
    "xpEarned": 150,
    "achievements": ["first_riddle", "speed_solver"],
    "nextPuzzle": "riddle_002"
  }
}
```

## 👤 Endpoints Utilisateur

### GET /user/profile
Récupère le profil utilisateur complet.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "cognimasterXX",
    "level": 12,
    "totalXP": 2847,
    "streak": 7,
    "joinDate": "2024-01-15T10:30:00Z",
    "stats": {
      "puzzlesSolved": 245,
      "averageScore": 87.5,
      "timeSpent": 1440,
      "categoriesCompleted": 3,
      "achievements": 28,
      "weeklyProgress": 15.5
    },
    "preferences": {
      "theme": "dark",
      "difficulty": "adaptive",
      "soundEnabled": true,
      "notifications": true
    }
  }
}
```

### GET /user/progress
Récupère la progression détaillée par catégorie.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "categoryId": "riddles",
        "levels": [
          {
            "level": 1,
            "completed": true,
            "score": 92,
            "puzzlesSolved": 100,
            "totalPuzzles": 100,
            "avgResponseTime": 35000,
            "unlocked": true,
            "unlockedAt": "2024-01-20T14:22:00Z"
          }
        ],
        "overallProgress": 34.5,
        "bestCategory": false,
        "recommendedNext": "visual"
      }
    ],
    "globalStats": {
      "completionRate": 34.5,
      "strongestSkills": ["logical_reasoning", "pattern_recognition"],
      "improvementAreas": ["spatial_reasoning", "working_memory"],
      "cognitiveAge": 28.5
    }
  }
}
```

### POST /user/session
Démarre une nouvelle session de jeu.

**Request Body:**
```json
{
  "categoryId": "riddles",
  "level": 1,
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "screenResolution": "1920x1080",
    "timezone": "Europe/Paris"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123",
    "startTime": "2024-01-25T09:15:00Z",
    "securityToken": "sec_xyz789",
    "antiCheatConfig": {
      "focusMonitoring": true,
      "timeThresholds": {
        "minimum": 5000,
        "maximum": 300000
      },
      "allowedViolations": 3
    }
  }
}
```

## 🔒 Endpoints Sécurité

### POST /security/report-violation
Signale une violation de sécurité détectée côté client.

**Request Body:**
```json
{
  "sessionId": "sess_abc123",
  "violationType": "focus_loss",
  "timestamp": 1703090400000,
  "metadata": {
    "duration": 5000,
    "context": "puzzle_solving",
    "puzzleId": "riddle_001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "violationId": "viol_456",
    "severity": "warning",
    "action": "continue",
    "remainingViolations": 2,
    "message": "Attention : perte de focus détectée. Restez concentré sur votre puzzle."
  }
}
```

### GET /security/session-status/:sessionId
Vérifie le statut de sécurité d'une session.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123",
    "status": "active",
    "violations": 1,
    "maxViolations": 5,
    "riskLevel": "low",
    "securityScore": 95,
    "lastActivity": "2024-01-25T09:30:00Z"
  }
}
```

## 📊 Endpoints Statistiques

### GET /stats/leaderboard
Récupère le classement global ou par catégorie.

**Query Parameters:**
- `category`: Catégorie spécifique (optionnel)
- `timeframe`: day/week/month/all
- `limit`: Nombre de résultats (défaut: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "username": "CognitiveMaster",
        "score": 98.5,
        "xp": 5420,
        "level": 18,
        "streak": 23,
        "country": "FR"
      }
    ],
    "userRank": {
      "position": 156,
      "percentile": 78.5,
      "score": 87.2
    },
    "metadata": {
      "totalUsers": 2847,
      "category": "all",
      "timeframe": "week",
      "lastUpdated": "2024-01-25T10:00:00Z"
    }
  }
}
```

### GET /stats/cognitive-report
Génère un rapport cognitif personnalisé.

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "report_789",
    "generatedAt": "2024-01-25T10:15:00Z",
    "period": "last_30_days",
    "cognitiveProfile": {
      "workingMemory": {
        "score": 85,
        "percentile": 72,
        "trend": "improving",
        "description": "Votre mémoire de travail est au-dessus de la moyenne"
      },
      "processingSpeed": {
        "score": 92,
        "percentile": 86,
        "trend": "stable",
        "description": "Excellente vitesse de traitement des informations"
      },
      "logicalReasoning": {
        "score": 78,
        "percentile": 65,
        "trend": "improving",
        "description": "Bonne capacité de raisonnement logique en progression"
      }
    },
    "recommendations": [
      {
        "category": "spatial",
        "reason": "Pour améliorer votre raisonnement visuo-spatial",
        "expectedImprovement": "15-20%",
        "scientificBasis": "Études de Newcombe & Frick (2010) sur la plasticité spatiale"
      }
    ],
    "achievements": [
      "Amélioration de 12% en mémoire de travail",
      "Série de 7 jours consécutifs",
      "Maîtrise des énigmes logiques niveau 2"
    ]
  }
}
```

## ⚙️ Configuration et métadonnées

### GET /config/app
Récupère la configuration de l'application.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "features": {
      "antiCheatEnabled": true,
      "leaderboardEnabled": true,
      "socialFeaturesEnabled": false,
      "aiRecommendationsEnabled": true
    },
    "limits": {
      "maxSessionDuration": 3600000,
      "maxDailyPuzzles": 200,
      "maxViolationsPerSession": 5
    },
    "cognitiveCategories": [
      {
        "id": "riddles",
        "maxLevel": 3,
        "puzzlesPerLevel": 100,
        "unlockThreshold": 90
      }
    ]
  }
}
```

## 🚨 Codes d'erreur

### Erreurs communes
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token d'authentification invalide ou expiré",
    "details": {
      "timestamp": "2024-01-25T10:00:00Z",
      "requestId": "req_xyz123"
    }
  }
}
```

### Codes d'erreur spécifiques
- `AUTH_001`: Token invalide
- `AUTH_002`: Token expiré
- `AUTH_003`: Permissions insuffisantes
- `PUZZLE_001`: Puzzle non trouvé
- `PUZZLE_002`: Réponse invalide
- `PUZZLE_003`: Délai de réponse dépassé
- `SECURITY_001`: Violation de sécurité détectée
- `SECURITY_002`: Session compromise
- `SECURITY_003`: Trop de violations
- `RATE_001`: Limite de requêtes dépassée
- `DATA_001`: Données corrompues
- `DATA_002`: Format de données invalide

## 🔧 Authentification et sécurité

### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_123",
    "iat": 1703090400,
    "exp": 1703176800,
    "scope": ["puzzles:read", "progress:write"],
    "deviceId": "device_abc123"
  }
}
```

### Rate Limiting
- **Authentification**: 5 tentatives/minute
- **Puzzles**: 100 requêtes/minute
- **Réponses**: 1 réponse/seconde/puzzle
- **Rapports**: 10 requêtes/heure

### Chiffrement
- **TLS 1.3** pour toutes les communications
- **AES-256** pour les données sensibles
- **HMAC-SHA256** pour l'intégrité des données
- **RSA-2048** pour l'échange de clés

## 📱 Webhooks (Futur)

### Configuration des webhooks
```json
{
  "url": "https://votre-app.com/webhooks/cogniquest",
  "events": ["puzzle.completed", "level.unlocked", "achievement.earned"],
  "secret": "whsec_abc123..."
}
```

### Format des événements
```json
{
  "id": "evt_123",
  "type": "puzzle.completed",
  "created": 1703090400,
  "data": {
    "userId": "user_123",
    "puzzleId": "riddle_001",
    "score": 95,
    "responseTime": 45000
  }
}
```

---

Cette documentation API couvre tous les aspects de l'intégration avec CogniQuest++, depuis l'authentification jusqu'aux fonctionnalités avancées de sécurité et d'analytics.
