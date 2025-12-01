import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieConsent } from '../models/cookie-consent.model';

const CONSENT_KEY = 'easy-cookie-consent';
const CONSENT_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly consentSubject = new BehaviorSubject<CookieConsent | null>(
    this.load()
  );
  readonly consent$ = this.consentSubject.asObservable();

  get current(): CookieConsent | null {
    return this.consentSubject.value;
  }

  get hasAnswered(): boolean {
    return !!this.current;
  }

  get analyticsEnabled(): boolean {
    return !!this.current?.analytics;
  }

  acceptAnalytics(): void {
    this.save({
      version: CONSENT_VERSION,
      analytics: true,
      updatedAt: new Date().toISOString(),
    });
  }

  rejectAnalytics(): void {
    this.save({
      version: CONSENT_VERSION,
      analytics: false,
      updatedAt: new Date().toISOString(),
    });
  }

  private load(): CookieConsent | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as CookieConsent;
      if (parsed.version !== CONSENT_VERSION) {
        return null;
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }

  private save(consent: CookieConsent): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
      } catch (error) {
        // Ignore storage persistence errors
      }
    }

    this.consentSubject.next(consent);
  }
}
