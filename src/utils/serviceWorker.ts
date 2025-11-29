// Service Worker registration and management
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    installPWA?: () => Promise<void>;
  }
}

export class ServiceWorkerManager {
  private static registration: ServiceWorkerRegistration | null = null;

  static async register(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registered successfully');

        // Handle updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration?.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                this.notifyUpdate();
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleMessage(event);
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  static async unregister(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
        console.log('Service Worker unregistered');
      } catch (error) {
        console.error('Service Worker unregistration failed:', error);
      }
    }
  }

  private static notifyUpdate(): void {
    // Show update notification to user
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Mise à jour disponible', {
        body: 'Une nouvelle version de CogniQuest est disponible. Actualisez pour bénéficier des dernières fonctionnalités.',
        icon: '/favicon.ico'
      });
    }

    // Dispatch custom event for UI update
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  }

  private static handleMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'sync-complete':
        console.log('Background sync completed');
        window.dispatchEvent(new CustomEvent('sync-complete', { detail: data }));
        break;
      case 'cache-updated':
        console.log('Cache updated');
        break;
      default:
        console.log('Unknown service worker message:', type);
    }
  }

  static async update(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update();
        console.log('Service Worker updated');
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  }

  static getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  static isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }
}

// Initialize service worker when module loads
if (typeof window !== 'undefined') {
  // Register service worker after page load
  window.addEventListener('load', () => {
    ServiceWorkerManager.register();
  });

  // Handle PWA install prompt
  let deferredPrompt: BeforeInstallPromptEvent | null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  });

  // Function to trigger install
  window.installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install outcome: ${outcome}`);
      deferredPrompt = null;
    }
  };
}