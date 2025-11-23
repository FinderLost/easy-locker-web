import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { Analytics, getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private analytics?: Analytics;
  private initPromise?: Promise<void>;
  private pendingEvents: Array<{ name: string; params: Record<string, any> }> = [];

  constructor(private router: Router) {
    this.bootstrapAnalytics();
  }

  private bootstrapAnalytics(): void {
    if (this.initPromise || typeof window === 'undefined') {
      return;
    }

    this.initPromise = (async () => {
      try {
        const supported = await isSupported();
        if (!supported) {
          console.warn('[Analytics] No soportado en este navegador');
          return;
        }

        const app = initializeApp(environment.firebaseConfig);
        this.analytics = getAnalytics(app);
        console.info('[Analytics] Inicializado OK');
        this.registerRouterTracking();
        this.logEvent('easy_init');
        this.flushPendingEvents();
      } catch (error) {
        console.warn('[Analytics] No se pudo inicializar Firebase Analytics', error);
      }
    })();
  }

  private registerRouterTracking(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  trackPageView(path: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.logEvent('page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
    });
  }

  logEvent(eventName: string, params: Record<string, any> = {}): void {
    if (!this.analytics) {
      this.pendingEvents.push({ name: eventName, params });
      return;
    }

    this.dispatchEvent(eventName, params);
  }

  private dispatchEvent(eventName: string, params: Record<string, any>): void {
    if (!this.analytics) {
      return;
    }

    const payload = {
      ...this.getCommonEventParams(),
      ...params,
    };

    logEvent(this.analytics, eventName, payload);
  }

  private flushPendingEvents(): void {
    if (!this.analytics || this.pendingEvents.length === 0) {
      return;
    }

    const queue = [...this.pendingEvents];
    this.pendingEvents = [];
    queue.forEach(({ name, params }) => this.dispatchEvent(name, params));
  }

  private getCommonEventParams(): { lang: string; theme: string } {
    const lang =
      typeof document !== 'undefined'
        ? document.documentElement.lang || 'es'
        : 'es';
    const storedTheme =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('theme-preference')
        : null;

    return {
      lang,
      theme: this.normalizeTheme(storedTheme),
    };
  }

  private normalizeTheme(value: string | null): 'light' | 'dark' | 'system' {
    if (value === 'light' || value === 'dark') {
      return value;
    }
    return 'system';
  }
}
