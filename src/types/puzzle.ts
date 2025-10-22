
export interface Puzzle {
  id: string;
  title: string;
  description: string;
  type: 'riddle' | 'visual' | 'logic' | 'sequence' | 'memory' | 'calculation' | 'spatial' | 'emotional' | 'orientation' | 'language';
  level: number;
  difficulty: number;
  timeLimit: number;
  content: any;
  solution: any;
  explanation?: string;
  cognitiveSkills: string[];
  scientificBasis?: string;
}

export interface PuzzleStats {
  averageTime: number;
  successRate: number;
  attempts: number;
  bestTime: number;
}
