interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.attempts.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingAttempts(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - entry.count);
  }

  getResetTime(key: string): number {
    const entry = this.attempts.get(key);
    return entry ? entry.resetTime : 0;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Global rate limiters
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 auth attempts per 15 min
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 API calls per minute
export const puzzleRateLimiter = new RateLimiter(50, 60 * 1000); // 50 puzzle attempts per minute

export { RateLimiter };