type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}

class Logger {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry(level, message, context);

    // Console logging with appropriate level
    const consoleMethod = level === 'debug' ? 'debug' :
                         level === 'info' ? 'info' :
                         level === 'warn' ? 'warn' : 'error';

    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, entry);

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(entry);
    }

    // Store critical errors locally for debugging
    if (level === 'error') {
      this.storeLocalError(entry);
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      // Example: Send to logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });

      // For now, just log that we would send it
      console.log('Would send to logging service:', entry);
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  private storeLocalError(entry: LogEntry) {
    try {
      const errors = JSON.parse(localStorage.getItem('cogniquest_errors') || '[]');
      errors.push(entry);

      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }

      localStorage.setItem('cogniquest_errors', JSON.stringify(errors));
    } catch (error) {
      console.error('Failed to store local error:', error);
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    const errorContext = {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    };

    this.log('error', message, errorContext);
  }

  // Specialized logging methods
  logPuzzleAttempt(puzzleId: string, success: boolean, timeSpent: number, context?: Record<string, unknown>) {
    this.info(`Puzzle attempt: ${puzzleId}`, {
      ...context,
      puzzleId,
      success,
      timeSpent,
      type: 'puzzle_attempt'
    });
  }

  logUserAction(action: string, context?: Record<string, unknown>) {
    this.info(`User action: ${action}`, {
      ...context,
      action,
      type: 'user_action'
    });
  }

  logPerformance(metric: string, value: number, context?: Record<string, unknown>) {
    this.info(`Performance: ${metric} = ${value}`, {
      ...context,
      metric,
      value,
      type: 'performance'
    });
  }

  getStoredErrors(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('cogniquest_errors') || '[]');
    } catch {
      return [];
    }
  }

  clearStoredErrors() {
    localStorage.removeItem('cogniquest_errors');
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;