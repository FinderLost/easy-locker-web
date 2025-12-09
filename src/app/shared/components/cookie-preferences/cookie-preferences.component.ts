import { Component, EventEmitter, Output } from '@angular/core';
import { CookieConsentService } from '../../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-preferences',
  templateUrl: './cookie-preferences.component.html',
  styleUrls: ['./cookie-preferences.component.css'],
})
export class CookiePreferencesComponent {
  @Output() closed = new EventEmitter<void>();

  constructor(public cookieConsent: CookieConsentService) {}

  toggleAnalytics(): void {
    if (this.cookieConsent.analyticsEnabled) {
      this.cookieConsent.rejectAnalytics();
    } else {
      this.cookieConsent.acceptAnalytics();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
