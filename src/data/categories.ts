
import { 
  Brain, 
  Eye, 
  Lightbulb, 
  Workflow, 
  Target, 
  Calculator, 
  Shapes, 
  Heart, 
  Compass, 
  MessageCircle,
  LucideIcon 
} from 'lucide-react';

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  levels: {
    name: string;
    description: string;
    puzzlesRequired: number;
    minimumScore: number;
  }[];
  cognitiveSkills: string[];
  scientificBasis: string;
}

export const categories: Category[] = [
  {
    id: 'riddles-enigmas',
    title: 'Devinettes & Énigmes',
    description: 'Développez votre pensée créative et votre capacité de déduction logique',
    icon: Brain,
    levels: [
      { name: 'Novice', description: 'Énigmes simples et devinettes classiques', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Expert', description: 'Problèmes complexes et défis logiques', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Maître', description: 'Énigmes avancées et casse-têtes sophistiqués', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Pensée créative', 'Déduction logique', 'Résolution de problèmes'],
    scientificBasis: 'Stimule le cortex préfrontal et améliore la flexibilité cognitive (Nature Neuroscience, 2019)'
  },
  {
    id: 'visual-puzzles',
    title: 'Casse-têtes Visuels',
    description: 'Renforcez votre perception spatiale et votre traitement visuel',
    icon: Eye,
    levels: [
      { name: 'Observateur', description: 'Puzzles visuels de base', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Analyste', description: 'Défis de perception complexes', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Visionnaire', description: 'Puzzles visuels avancés', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Perception spatiale', 'Traitement visuel', 'Attention sélective'],
    scientificBasis: 'Améliore le traitement dans le cortex pariétal (Journal of Vision, 2020)'
  },
  {
    id: 'logical-reasoning',
    title: 'Raisonnement Logique',
    description: 'Perfectionnez votre logique déductive et inductive',
    icon: Lightbulb,
    levels: [
      { name: 'Logicien', description: 'Bases du raisonnement logique', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Stratège', description: 'Raisonnement complexe', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Philosophe', description: 'Logique avancée et paradoxes', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Raisonnement déductif', 'Logique inductive', 'Analyse critique'],
    scientificBasis: 'Renforce les connexions dans le cortex préfrontal dorsolatéral (Cognitive Science, 2018)'
  },
  {
    id: 'sequences-patterns',
    title: 'Séquences & Motifs',
    description: 'Développez votre reconnaissance de motifs et anticipation',
    icon: Workflow,
    levels: [
      { name: 'Détecteur', description: 'Motifs simples et séquences basiques', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Prévisionniste', description: 'Séquences complexes', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Oracle', description: 'Motifs sophistiqués et prédictions', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Reconnaissance de motifs', 'Anticipation', 'Mémoire de travail'],
    scientificBasis: 'Active l\'hippocampe et améliore la mémoire prédictive (Science, 2019)'
  },
  {
    id: 'memory-attention',
    title: 'Mémoire & Attention',
    description: 'Boostez votre concentration et votre capacité mnésique',
    icon: Target,
    levels: [
      { name: 'Concentré', description: 'Exercices de base attention/mémoire', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Focalisé', description: 'Défis de concentration intense', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Zen Master', description: 'Maîtrise totale attention/mémoire', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Attention soutenue', 'Mémoire de travail', 'Concentration'],
    scientificBasis: 'Améliore l\'activité dans le réseau attentionnel (PNAS, 2020)'
  },
  {
    id: 'mental-calculation',
    title: 'Calcul Mental & Stroop',
    description: 'Accélérez votre vitesse de traitement et contrôle inhibiteur',
    icon: Calculator,
    levels: [
      { name: 'Calculateur', description: 'Calculs rapides et effet Stroop', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Computeur', description: 'Défis arithmétiques complexes', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Mathématicien', description: 'Calculs avancés et inhibition', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Vitesse de traitement', 'Contrôle inhibiteur', 'Calcul mental'],
    scientificBasis: 'Renforce le cortex cingulaire antérieur (Neuropsychologia, 2019)'
  },
  {
    id: 'spatial-creativity',
    title: 'Créativité Spatiale',
    description: 'Explorez la géométrie 3D et les puzzles de formes',
    icon: Shapes,
    levels: [
      { name: 'Sculpteur', description: 'Puzzles 3D et Tangrams simples', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Architecte', description: 'Constructions spatiales complexes', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Génie Spatial', description: 'Défis géométriques avancés', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Rotation mentale', 'Visualisation 3D', 'Créativité spatiale'],
    scientificBasis: 'Active le cortex pariétal supérieur (NeuroImage, 2018)'
  },
  {
    id: 'emotional-intelligence',
    title: 'Intelligence Émotionnelle',
    description: 'Développez votre empathie et reconnaissance émotionnelle',
    icon: Heart,
    levels: [
      { name: 'Empathique', description: 'Reconnaissance émotions de base', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Psychologue', description: 'Analyse émotionnelle complexe', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Sage Émotionnel', description: 'Maîtrise intelligence émotionnelle', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Empathie', 'Reconnaissance émotionnelle', 'Intelligence sociale'],
    scientificBasis: 'Améliore l\'activité de l\'amygdale et du cortex orbitofrontal (Emotion, 2020)'
  },
  {
    id: 'spatial-orientation',
    title: 'Orientation Spatiale',
    description: 'Maîtrisez la navigation et le repérage dans l\'espace',
    icon: Compass,
    levels: [
      { name: 'Explorateur', description: 'Labyrinthes simples et repérage', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Navigateur', description: 'Navigation complexe et cartes', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Cartographe', description: 'Maîtrise orientation avancée', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Navigation spatiale', 'Orientation', 'Mémoire topographique'],
    scientificBasis: 'Stimule l\'hippocampe et le cortex entorhinal (Current Biology, 2019)'
  },
  {
    id: 'language-fluency',
    title: 'Langage & Fluidité Verbale',
    description: 'Enrichissez votre vocabulaire et fluidité linguistique',
    icon: MessageCircle,
    levels: [
      { name: 'Orateur', description: 'Anagrammes et mots simples', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Linguiste', description: 'Défis verbaux complexes', puzzlesRequired: 100, minimumScore: 90 },
      { name: 'Poète', description: 'Maîtrise langage et créativité', puzzlesRequired: 100, minimumScore: 90 }
    ],
    cognitiveSkills: ['Fluidité verbale', 'Vocabulaire', 'Créativité linguistique'],
    scientificBasis: 'Active les aires de Broca et Wernicke (Brain and Language, 2020)'
  }
];
