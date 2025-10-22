
import { Puzzle } from '@/types/puzzle';

export const puzzles: Record<string, Puzzle[]> = {
  'riddles-enigmas': [
    {
      id: 'riddle-1-1',
      title: 'L\'Énigme du Miroir',
      description: 'Une devinette classique de logique',
      type: 'riddle',
      level: 1,
      difficulty: 3,
      timeLimit: 45,
      content: {
        question: "Je vous montre le monde, mais à l'envers. Plus vous me regardez, plus vous vous voyez. Que suis-je ?",
        hint: "Réfléchissez à ce qui inverse votre image..."
      },
      solution: 'miroir',
      explanation: 'Un miroir reflète le monde en inversant l\'image et nous permet de nous voir.',
      cognitiveSkills: ['Pensée métaphorique', 'Déduction logique'],
      scientificBasis: 'Active le cortex préfrontal et améliore la pensée abstraite'
    },
    {
      id: 'riddle-1-2',
      title: 'Le Paradoxe du Temps',
      description: 'Une énigme sur la perception temporelle',
      type: 'riddle',
      level: 1,
      difficulty: 4,
      timeLimit: 60,
      content: {
        question: "Plus je cours vite, plus je deviens lent. Plus j'avance, plus je recule. Que suis-je ?",
        hint: "Pensez à quelque chose qui mesure..."
      },
      solution: 'horloge',
      explanation: 'Plus les aiguilles d\'une horloge tournent vite, plus le temps semble lent relativamente.',
      cognitiveSkills: ['Pensée paradoxale', 'Logique temporelle'],
      scientificBasis: 'Stimule la compréhension des concepts abstraits de temps et espace'
    }
    // ... plus de puzzles pour chaque niveau
  ],
  
  'visual-puzzles': [
    {
      id: 'visual-1-1',
      title: 'Rotation Mentale',
      description: 'Identifiez la forme après rotation',
      type: 'visual',
      level: 1,
      difficulty: 5,
      timeLimit: 30,
      content: {
        baseShape: '🔺',
        rotatedOptions: ['🔻', '◀️', '▶️', '🔺'],
        rotation: 180
      },
      solution: 1,
      explanation: 'La forme triangle pointant vers le haut devient triangle pointant vers le bas après rotation de 180°',
      cognitiveSkills: ['Rotation mentale', 'Perception spatiale'],
      scientificBasis: 'Active le cortex pariétal supérieur, crucial pour la navigation spatiale'
    }
  ],
  
  'logical-reasoning': [
    {
      id: 'logic-1-1',
      title: 'Syllogisme Simple',
      description: 'Déduction logique basique',
      type: 'logic',
      level: 1,
      difficulty: 4,
      timeLimit: 45,
      content: {
        premises: [
          "Tous les chats sont des mammifères",
          "Whiskers est un chat"
        ],
        question: "Que peut-on déduire sur Whiskers?"
      },
      solution: "Whiskers est un mammifère",
      explanation: 'Par déduction logique: si tous les chats sont des mammifères et Whiskers est un chat, alors Whiskers est un mammifère.',
      cognitiveSkills: ['Déduction logique', 'Raisonnement syllogistique'],
      scientificBasis: 'Renforce le cortex préfrontal dorsolatéral, zone clé du raisonnement'
    }
  ],
  
  'sequences-patterns': [
    {
      id: 'sequence-1-1',
      title: 'Suite Numérique',
      description: 'Trouvez le nombre suivant',
      type: 'sequence',
      level: 1,
      difficulty: 3,
      timeLimit: 30,
      content: {
        sequence: [2, 4, 8, 16, 32, '?'],
        type: 'geometric'
      },
      solution: 64,
      explanation: 'Chaque nombre est multiplié par 2: 32 × 2 = 64',
      cognitiveSkills: ['Reconnaissance de motifs', 'Calcul mental'],
      scientificBasis: 'Active l\'hippocampe et améliore la mémoire prédictive'
    }
  ],
  
  'memory-attention': [
    {
      id: 'memory-1-1',
      title: 'Séquence de Couleurs',
      description: 'Mémorisez et reproduisez la séquence',
      type: 'memory',
      level: 1,
      difficulty: 4,
      timeLimit: 20,
      content: {
        sequence: ['rouge', 'bleu', 'vert', 'jaune'],
        displayTime: 3000,
        type: 'color_sequence'
      },
      solution: ['rouge', 'bleu', 'vert', 'jaune'],
      explanation: 'La mémorisation de séquences améliore la mémoire de travail',
      cognitiveSkills: ['Mémoire de travail', 'Attention soutenue'],
      scientificBasis: 'Améliore l\'activité dans le réseau attentionnel frontopariétal'
    }
  ],
  
  'mental-calculation': [
    {
      id: 'calc-1-1',
      title: 'Calcul Rapide',
      description: 'Résolvez rapidement',
      type: 'calculation',
      level: 1,
      difficulty: 3,
      timeLimit: 15,
      content: {
        operation: '47 + 38',
        type: 'addition'
      },
      solution: 85,
      explanation: '47 + 38 = 85. Décomposition: 40 + 30 = 70, puis 7 + 8 = 15, total: 85',
      cognitiveSkills: ['Calcul mental', 'Vitesse de traitement'],
      scientificBasis: 'Renforce le sillon intrapariétal, zone du traitement numérique'
    }
  ],
  
  'spatial-creativity': [
    {
      id: 'spatial-1-1',
      title: 'Tangram Créatif',
      description: 'Formez un carré avec ces pièces',
      type: 'spatial',
      level: 1,
      difficulty: 6,
      timeLimit: 90,
      content: {
        pieces: ['triangle_large', 'triangle_medium', 'square', 'parallelogram'],
        target: 'square',
        type: 'tangram'
      },
      solution: ['piece_arrangement'],
      explanation: 'La créativité spatiale développe la visualisation 3D et la flexibilité cognitive',
      cognitiveSkills: ['Visualisation spatiale', 'Créativité', 'Résolution de problèmes'],
      scientificBasis: 'Active le cortex pariétal et temporal, régions de l\'imagination spatiale'
    }
  ],
  
  'emotional-intelligence': [
    {
      id: 'emotion-1-1',
      title: 'Reconnaissance Émotionnelle',
      description: 'Identifiez l\'émotion exprimée',
      type: 'emotional',
      level: 1,
      difficulty: 4,
      timeLimit: 20,
      content: {
        scenario: "Marie vient d'apprendre qu'elle a réussi son examen. Ses yeux brillent, elle sourit largement et serre ses amis dans ses bras.",
        emotions: ['Joie', 'Tristesse', 'Colère', 'Peur']
      },
      solution: 'Joie',
      explanation: 'Les signes (yeux brillants, sourire, embrassades) indiquent clairement la joie.',
      cognitiveSkills: ['Empathie', 'Reconnaissance émotionnelle', 'Intelligence sociale'],
      scientificBasis: 'Améliore l\'activité de l\'amygdale et du cortex orbitofrontal'
    }
  ],
  
  'spatial-orientation': [
    {
      id: 'orientation-1-1',
      title: 'Navigation Mentale',
      description: 'Trouvez le chemin le plus court',
      type: 'orientation',
      level: 1,
      difficulty: 5,
      timeLimit: 60,
      content: {
        maze: [
          ['S', '█', '░', '░'],
          ['░', '█', '░', '█'],
          ['░', '░', '░', '█'],
          ['█', '█', '░', 'E']
        ],
        start: [0, 0],
        end: [3, 3]
      },
      solution: [[0,0], [1,0], [2,0], [2,1], [2,2], [3,2], [3,3]],
      explanation: 'Le chemin optimal évite les obstacles (█) et connecte S à E.',
      cognitiveSkills: ['Navigation spatiale', 'Planification', 'Mémoire topographique'],
      scientificBasis: 'Stimule l\'hippocampe et le cortex entorhinal, zones de la navigation'
    }
  ],
  
  'language-fluency': [
    {
      id: 'language-1-1',
      title: 'Anagramme Créative',
      description: 'Trouvez le mot caché',
      type: 'language',
      level: 1,
      difficulty: 4,
      timeLimit: 45,
      content: {
        letters: 'NOIRAM',
        clue: 'Prénom féminin de 6 lettres',
        type: 'anagram'
      },
      solution: 'MARION',
      explanation: 'NOIRAM réarrangé donne MARION, un prénom féminin.',
      cognitiveSkills: ['Fluidité verbale', 'Anagrammes', 'Flexibilité cognitive'],
      scientificBasis: 'Active les aires de Broca et Wernicke, centres du langage'
    }
  ]
};

// Fonction pour générer plus de puzzles dynamiquement
export const generateMorePuzzles = (categoryId: string, level: number, count: number = 100): Puzzle[] => {
  const basePuzzles = puzzles[categoryId] || [];
  const generated: Puzzle[] = [];
  
  for (let i = 0; i < count; i++) {
    const baseIndex = i % basePuzzles.length;
    const basePuzzle = basePuzzles[baseIndex];
    
    if (basePuzzle) {
      generated.push({
        ...basePuzzle,
        id: `${categoryId}-${level}-${i + 1}`,
        level: level,
        difficulty: Math.min(10, basePuzzle.difficulty + Math.floor(level / 2)),
        timeLimit: Math.max(10, basePuzzle.timeLimit - (level * 5))
      });
    }
  }
  
  return generated;
};

// Fonction pour récupérer les puzzles par catégorie et niveau
export const getPuzzlesByCategory = (categoryId: string, level: number): Puzzle[] => {
  const categoryPuzzles = puzzles[categoryId] || [];
  
  // Si on a des puzzles de base pour cette catégorie, on les utilise pour le niveau 1
  if (level === 1 && categoryPuzzles.length > 0) {
    return categoryPuzzles;
  }
  
  // Pour les autres niveaux, on génère des puzzles basés sur les puzzles de base
  return generateMorePuzzles(categoryId, level, 20);
};
