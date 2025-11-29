import { SecurityUtils } from './security';

interface PuzzleAttempt {
  puzzleId: string;
  userId: string;
  categoryId: string;
  level: number;
  answer: unknown;
  timeSpent: number;
  timestamp: number;
}

interface ValidationResult {
  isValid: boolean;
  score: number;
  violations: string[];
  adjustedScore?: number;
}

export class ServerValidation {
  private static scoreHistory: Map<string, number[]> = new Map();
  private static attemptTimestamps: Map<string, number[]> = new Map();

  static validatePuzzleAttempt(attempt: PuzzleAttempt): ValidationResult {
    const violations: string[] = [];
    let adjustedScore = 100;

    // Check for rapid attempts (potential automation)
    const userAttempts = this.attemptTimestamps.get(attempt.userId) || [];
    const recentAttempts = userAttempts.filter(
      timestamp => Date.now() - timestamp < 1000 // Last second
    );

    if (recentAttempts.length > 3) {
      violations.push('Trop de tentatives rapides détectées');
      adjustedScore -= 30;
    }

    // Check for suspicious timing patterns
    if (attempt.timeSpent < 2) {
      violations.push('Temps de résolution suspect (trop rapide)');
      adjustedScore -= 20;
    }

    if (attempt.timeSpent > 300) { // 5 minutes
      violations.push('Temps de résolution suspect (trop lent)');
      adjustedScore -= 10;
    }

    // Check score consistency
    const userScores = this.scoreHistory.get(attempt.userId) || [];
    const avgScore = userScores.length > 0 ?
      userScores.reduce((a, b) => a + b, 0) / userScores.length : 50;

    if (adjustedScore > avgScore + 40 && userScores.length > 5) {
      violations.push('Amélioration de score suspecte');
      adjustedScore = Math.min(adjustedScore, avgScore + 20);
    }

    // Update history
    userScores.push(adjustedScore);
    if (userScores.length > 20) userScores.shift();
    this.scoreHistory.set(attempt.userId, userScores);

    userAttempts.push(Date.now());
    if (userAttempts.length > 50) userAttempts.shift();
    this.attemptTimestamps.set(attempt.userId, userAttempts);

    return {
      isValid: violations.length === 0,
      score: Math.max(0, adjustedScore),
      violations,
      adjustedScore: adjustedScore !== 100 ? adjustedScore : undefined
    };
  }

  static validateSessionIntegrity(sessionId: string, userId: string): boolean {
    // Simulate server-side session validation
    // In real implementation, this would check against server session store
    return sessionId && userId && sessionId.startsWith('session_');
  }

  static detectCheatingPatterns(userId: string): string[] {
    const violations: string[] = [];
    const scores = this.scoreHistory.get(userId) || [];
    const attempts = this.attemptTimestamps.get(userId) || [];

    // Check for perfect scores streak
    const perfectScores = scores.filter(score => score === 100);
    if (perfectScores.length > 5 && scores.length > 10) {
      violations.push('Trop de scores parfaits consécutifs');
    }

    // Check for timing patterns (exact same timing)
    const timingGroups = attempts.reduce((groups: { [key: number]: number }, time) => {
      const rounded = Math.floor(time / 1000) * 1000; // Round to second
      groups[rounded] = (groups[rounded] || 0) + 1;
      return groups;
    }, {});

    const suspiciousTimings = Object.values(timingGroups).filter(count => count > 3);
    if (suspiciousTimings.length > 0) {
      violations.push('Patterns de timing suspects détectés');
    }

    return violations;
  }

  static generatePuzzleSignature(puzzleData: unknown): string {
    // Create a signature for puzzle integrity
    const dataString = JSON.stringify(puzzleData);
    return SecurityUtils.hashPassword(dataString);
  }

  static validatePuzzleSignature(puzzleData: unknown, signature: string): boolean {
    const currentSignature = this.generatePuzzleSignature(puzzleData);
    return currentSignature === signature;
  }
}