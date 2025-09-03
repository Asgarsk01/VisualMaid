// Security utilities and middleware for enhanced protection

/**
 * Rate limiting utility to prevent brute force attacks
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if max attempts exceeded
    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    // Increment attempt count
    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, attempt] of this.attempts.entries()) {
      if (now - attempt.lastAttempt > this.windowMs) {
        this.attempts.delete(key);
      }
    }
  }
}

/**
 * Input sanitization utility
 */
export class InputSanitizer {
  /**
   * Sanitize email input
   */
  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize password input
   */
  static sanitizePassword(password: string): string {
    return password.trim();
  }

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Sanitize name input
   */
  static sanitizeName(name: string): string {
    return name.trim().replace(/[<>]/g, '');
  }
}

/**
 * CSRF protection utility
 */
export class CSRFProtection {
  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static createToken(): string {
    const token = this.generateToken();
    // In a real app, store this in a secure HTTP-only cookie
    return token;
  }

  static validateToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }
}

/**
 * Security headers configuration
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Content Security Policy
 */
export const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://www.gstatic.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'https://api.dicebear.com'],
  'connect-src': ["'self'", 'https://identitytoolkit.googleapis.com'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

/**
 * Environment validation
 */
export class EnvironmentValidator {
  static validateRequiredEnvVars(): void {
    const required = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID'
    ];

    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      console.error('Missing required environment variables:', missing);
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  static isProduction(): boolean {
    return import.meta.env.PROD;
  }

  static isDevelopment(): boolean {
    return import.meta.env.DEV;
  }
}

/**
 * Session management utility
 */
export class SessionManager {
  private static readonly SESSION_KEY = 'visualmaid_session';
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static createSession(userId: string): void {
    const session = {
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_TIMEOUT
    };
    
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  static getSession(): { userId: string; createdAt: number; expiresAt: number } | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData);
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static isSessionValid(): boolean {
    return this.getSession() !== null;
  }
}
