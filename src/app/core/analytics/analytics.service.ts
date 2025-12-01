import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  Analytics,
  getAnalytics,
  isSupported,
  logEvent,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieConsentService } from '../services/cookie-consent.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService implements OnDestroy {
  private app: FirebaseApp | null = null;
  private analytics: Analytics | null = null;
  private initPromise?: Promise<void>;
  private pendingEvents: Array<{ name: string; params: Record<string, any> }> =
    [];
  private destroy$ = new Subject<void>();
  private initializationAttempted = false;

  constructor(private router: Router, private consent: CookieConsentService) {
    this.observeConsentChanges();
    this.registerRouterTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackEvent(eventName: string, params: Record<string, any> = {}): void {
    if (!this.consent.analyticsEnabled) {
      return;
    }

    if (!this.analytics) {
      this.pendingEvents.push({ name: eventName, params });
      this.init();
      return;
    }

    this.dispatchEvent(eventName, params);
  }

  private registerRouterTracking(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  trackPageView(path: string): void {
    if (typeof window === 'undefined' || !this.consent.analyticsEnabled) {
      return;
    }

    this.trackEvent('page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
    });
  }

  private dispatchEvent(eventName: string, params: Record<string, any>): void {
    if (!this.analytics || !this.consent.analyticsEnabled) {
      return;
    }

    const payload = {
      ...this.getCommonEventParams(),
      ...params,
    };

    logEvent(this.analytics, eventName, payload);
  }

  private flushPendingEvents(): void {
    if (!this.analytics || !this.pendingEvents.length) {
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

  private observeConsentChanges(): void {
    this.consent.consent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((consent) => {
        if (consent?.analytics) {
          this.init();
        } else {
          if (this.analytics) {
            setAnalyticsCollectionEnabled(this.analytics, false);
          }
          this.pendingEvents = [];
          this.initializationAttempted = false;
        }
      });
  }

  private init(): void {
    if (this.initializationAttempted || !this.consent.analyticsEnabled) {
      return;
    }

    this.initializationAttempted = true;
    this.initPromise = (async () => {
      try {
        const supported = await isSupported();
        if (!supported) {
          console.warn('[Analytics] No soportado en este navegador');
          return;
        }

        this.app = initializeApp(environment.firebaseConfig);
        this.analytics = getAnalytics(this.app);
        setAnalyticsCollectionEnabled(this.analytics, true);
        console.info('[Analytics] Inicializado OK');
        this.trackEvent('easy_init');
        this.flushPendingEvents();
      } catch (error) {
        console.warn(
          '[Analytics] No se pudo inicializar Firebase Analytics',
          error
        );
      }
    })();
  }
}
