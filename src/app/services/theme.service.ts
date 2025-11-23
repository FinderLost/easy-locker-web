import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsService } from '../core/analytics/analytics.service';

export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'theme-preference';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private preference = new BehaviorSubject<ThemePreference>('system');
  private darkMode = new BehaviorSubject<boolean>(false);
  private mediaQuery?: MediaQueryList;

  preference$ = this.preference.asObservable();
  darkMode$ = this.darkMode.asObservable();

  private mediaListener = (event: MediaQueryListEvent) => {
    if (this.preference.value === 'system') {
      this.applyDarkMode(event.matches);
    }
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private analytics: AnalyticsService
  ) {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.mediaListener);
    }

    const storedPreference = this.readStoredPreference();
    this.setPreference(storedPreference, false);
  }

  ngOnDestroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
  }

  setPreference(preference: ThemePreference, persist = true): void {
    const previous = this.preference.value;
    this.preference.next(preference);
    const shouldUseDark = this.resolveIsDark(preference);
    this.applyDarkMode(shouldUseDark);

    if (!persist) {
      return;
    }

    this.persistPreference(preference);

    if (previous !== preference) {
      this.analytics.logEvent('nav_change_theme', {
        previous_theme: previous,
        new_theme: preference,
      });
    }
  }

  cyclePreference(): void {
    const order: ThemePreference[] = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(this.preference.value);
    const nextPreference = order[(currentIndex + 1) % order.length];
    this.setPreference(nextPreference);
  }

  private resolveIsDark(preference: ThemePreference): boolean {
    if (preference === 'dark') {
      return true;
    }
    if (preference === 'light') {
      return false;
    }
    return this.mediaQuery ? this.mediaQuery.matches : false;
  }

  private applyDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);
    const classList = this.document?.documentElement.classList;
    if (!classList) {
      return;
    }
    classList.toggle('dark', isDark);
  }

  private readStoredPreference(): ThemePreference {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'system';
    }

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }

      const legacy = localStorage.getItem('theme') as ThemePreference | null;
      if (legacy === 'light' || legacy === 'dark') {
        localStorage.removeItem('theme');
        localStorage.setItem(THEME_STORAGE_KEY, legacy);
        return legacy;
      }
    } catch (error) {
      // Ignore storage failures and fall back to system
    }

    return 'system';
  }

  private persistPreference(preference: ThemePreference): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      if (preference === 'system') {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, preference);
      }
    } catch (error) {
      // Ignore storage access issues (e.g., private mode)
    }
  }
}
