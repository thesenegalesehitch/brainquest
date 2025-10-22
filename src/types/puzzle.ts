
export interface Puzzle {
  id: string;
  title: string;
  description: string;
  type: 'riddle' | 'visual' | 'logic' | 'sequence' | 'memory' | 'calculation' | 'spatial' | 'emotional' | 'orientation' | 'language';
  level: number;
  difficulty: number;
  timeLimit: number;
  content: PuzzleContent;
  solution: PuzzleSolution;
  explanation?: string;
  cognitiveSkills: string[];
  scientificBasis?: string;
}

export type PuzzleContent =
  | RiddleContent
  | VisualContent
  | LogicContent
  | SequenceContent
  | MemoryContent
  | CalculationContent
  | SpatialContent
  | EmotionalContent
  | OrientationContent
  | LanguageContent;

export type PuzzleSolution = string | number | number[] | string[] | number[][];

export interface RiddleContent {
  question: string;
  hint?: string;
}

export interface VisualContent {
  baseShape: string;
  rotatedOptions: string[];
  rotation: number;
}

export interface LogicContent {
  premises: string[];
  question: string;
}

export interface SequenceContent {
  sequence: number[];
  type: string;
}

export interface MemoryContent {
  sequence: string[];
  displayTime: number;
  type: string;
}

export interface CalculationContent {
  operation: string;
  type: string;
}

export interface SpatialContent {
  pieces: string[];
  target: string;
  type: string;
}

export interface EmotionalContent {
  scenario: string;
  emotions: string[];
}

export interface OrientationContent {
  maze: string[][];
  start: [number, number];
  end: [number, number];
}

export interface LanguageContent {
  letters: string;
  clue: string;
  type: string;
}

export interface PuzzleStats {
  averageTime: number;
  successRate: number;
  attempts: number;
  bestTime: number;
}
