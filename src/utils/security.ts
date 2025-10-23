import CryptoJS from 'crypto-js';

// Simple encryption key - in production, this should be environment variable
const ENCRYPTION_KEY = 'cogniquest_secure_key_2024';

export class SecurityUtils {
  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  static hashPassword(password: string): string {
    // Simple hash simulation - in production use bcrypt or similar
    return CryptoJS.SHA256(password + 'salt').toString();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUsername(username: string): boolean {
    // Username: 3-20 chars, alphanumeric + underscore
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  static sanitizeInput(input: string): string {
    // Basic XSS prevention
    return input
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static generateSecureToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  static validatePassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}

export class SecureStorage {
  static setItem(key: string, value: any, encrypt: boolean = true): void {
    try {
      const data = JSON.stringify(value);
      const storedData = encrypt ? SecurityUtils.encrypt(data) : data;
      localStorage.setItem(key, storedData);
    } catch (error) {
      console.error('Secure storage set failed:', error);
    }
  }

  static getItem<T>(key: string, decrypt: boolean = true): T | null {
    try {
      const storedData = localStorage.getItem(key);
      if (!storedData) return null;

      const data = decrypt ? SecurityUtils.decrypt(storedData) : storedData;
      return JSON.parse(data);
    } catch (error) {
      console.error('Secure storage get failed:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

export class SessionManager {
  private static readonly SESSION_KEY = 'cogniquest_session';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static createSession(userId: string): void {
    const session = {
      userId,
      token: SecurityUtils.generateSecureToken(),
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION
    };
    SecureStorage.setItem(this.SESSION_KEY, session);
  }

  static getSession(): any {
    const session = SecureStorage.getItem(this.SESSION_KEY);
    if (!session) return null;

    if (Date.now() > (session as any).expiresAt) {
      this.clearSession();
      return null;
    }

    return session;
  }

  static validateSession(): boolean {
    const session = this.getSession();
    return session !== null;
  }

  static clearSession(): void {
    SecureStorage.removeItem(this.SESSION_KEY);
  }

  static extendSession(): void {
    const session = this.getSession();
    if (session) {
      session.expiresAt = Date.now() + this.SESSION_DURATION;
      SecureStorage.setItem(this.SESSION_KEY, session);
    }
  }
}