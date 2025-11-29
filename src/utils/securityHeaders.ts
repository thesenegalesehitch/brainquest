// Security headers and CSP implementation
export class SecurityHeaders {
  static getCSP(): string {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.github.com https://cdn.jsdelivr.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    return csp.join('; ');
  }

  static applySecurityHeaders(): void {
    // Set CSP header - DISABLED for now as it causes issues in production
    // const meta = document.createElement('meta');
    // meta.httpEquiv = 'Content-Security-Policy';
    // meta.content = this.getCSP();
    // document.head.appendChild(meta);

    // Set other security headers via meta tags
    const securityHeaders = [
      { name: 'X-Content-Type-Options', value: 'nosniff' },
      { name: 'X-Frame-Options', value: 'DENY' },
      { name: 'X-XSS-Protection', value: '1; mode=block' },
      { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
    ];

    securityHeaders.forEach(({ name, value }) => {
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = name;
      metaTag.content = value;
      document.head.appendChild(metaTag);
    });
  }

  static setDocumentSecurity(): void {
    // Prevent context menu on production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
    }

    // Prevent drag and drop
    document.addEventListener('dragstart', (e) => {
      if (e.target && (e.target as HTMLElement).tagName !== 'IMG') {
        e.preventDefault();
      }
    });

    // Prevent text selection on sensitive elements
    const sensitiveSelectors = ['.password-input', '.token-display', '.admin-panel'];
    sensitiveSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        (element as HTMLElement).style.userSelect = 'none';
        (element as HTMLElement).style.webkitUserSelect = 'none';
      });
    });
  }

  static validateOrigin(origin: string): boolean {
    const allowedOrigins = [
      window.location.origin,
      'https://cogniquest.app',
      'https://www.cogniquest.app'
    ];

    return allowedOrigins.includes(origin);
  }

  static sanitizeHTML(input: string): string {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
  }

  static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  static validateFileUpload(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }
}

// Apply security headers when module loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    SecurityHeaders.applySecurityHeaders();
    SecurityHeaders.setDocumentSecurity();
  });
}