import { Component } from '@angular/core';
import { CookieConsentService } from '../../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css'],
})
export class CookieBannerComponent {
  showPreferences = false;

  constructor(public cookieConsent: CookieConsentService) {}

  acceptAll(): void {
    this.cookieConsent.acceptAnalytics();
  }

  acceptEssential(): void {
    this.cookieConsent.rejectAnalytics();
  }

  togglePreferences(): void {
    this.showPreferences = !this.showPreferences;
  }
}
