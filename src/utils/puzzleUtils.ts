export const calculatePoints = (isCorrect: boolean, responseTime: number, difficulty: number, timeRemaining: number): number => {
  if (!isCorrect) return 0;

  const basePoints = difficulty * 10;
  const speedBonus = Math.max(0, timeRemaining * 2);
  const difficultyBonus = difficulty * 5;

  return Math.floor(basePoints + speedBonus + difficultyBonus);
};

export const validatePuzzleAnswer = (userAnswer: unknown, solution: unknown): boolean => {
  if (typeof solution === 'string' && typeof userAnswer === 'string') {
    return userAnswer.toLowerCase().trim() === solution.toLowerCase().trim();
  }
  if (typeof solution === 'number' && typeof userAnswer === 'number') {
    return userAnswer === solution;
  }
  if (Array.isArray(solution) && Array.isArray(userAnswer)) {
    return JSON.stringify(userAnswer) === JSON.stringify(solution);
  }
  return false;
};

export const getPuzzleDifficultyColor = (difficulty: number): string => {
  if (difficulty <= 3) return 'text-green-400';
  if (difficulty <= 6) return 'text-yellow-400';
  if (difficulty <= 8) return 'text-orange-400';
  return 'text-red-400';
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateAverageResponseTime = (sessionResults: Array<{ responseTime: number }>): number => {
  if (sessionResults.length === 0) return 0;
  const total = sessionResults.reduce((acc, result) => acc + result.responseTime, 0);
  return Math.round(total / sessionResults.length);
};

export const calculateAccuracyRate = (sessionResults: Array<{ isCorrect: boolean }>): number => {
  if (sessionResults.length === 0) return 0;
  const correct = sessionResults.filter(result => result.isCorrect).length;
  return Math.round((correct / sessionResults.length) * 100);
};