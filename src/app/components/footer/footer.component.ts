import { Component } from '@angular/core';
import {
  FOOTER_SOCIAL_ICONS,
  FOOTER_LINK_ICONS,
  SecureIcon,
} from './footer-icons';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnalyticsService } from '../../core/analytics/analytics.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  socialIcons: Record<'facebook' | 'instagram' | 'tiktok', SafeHtml>;
  linkIcons: Record<'email' | 'terms' | 'cookies' | 'whatsapp', SafeHtml>;
  secureIcon: SafeHtml;
  currentYear = new Date().getFullYear();
  isDarkMode = false;
  showCookiePreferences = false;

  constructor(
    private translate: TranslateService,
    public themeService: ThemeService,
    private sanitizer: DomSanitizer,
    private analytics: AnalyticsService
  ) {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
    this.socialIcons = {
      facebook: this.sanitizer.bypassSecurityTrustHtml(
        FOOTER_SOCIAL_ICONS.facebook
      ),
      instagram: this.sanitizer.bypassSecurityTrustHtml(
        FOOTER_SOCIAL_ICONS.instagram
      ),
      tiktok: this.sanitizer.bypassSecurityTrustHtml(
        FOOTER_SOCIAL_ICONS.tiktok
      ),
    };
    this.linkIcons = {
      email: this.sanitizer.bypassSecurityTrustHtml(FOOTER_LINK_ICONS.email),
      terms: this.sanitizer.bypassSecurityTrustHtml(FOOTER_LINK_ICONS.terms),
      cookies: this.sanitizer.bypassSecurityTrustHtml(
        FOOTER_LINK_ICONS.cookies
      ),
      whatsapp: this.sanitizer.bypassSecurityTrustHtml(
        FOOTER_LINK_ICONS.whatsapp
      ),
    };
    this.secureIcon = this.sanitizer.bypassSecurityTrustHtml(SecureIcon);
  }
  getTermsUrl(): string {
    const lang = this.translate.currentLang || 'es';
    switch (lang) {
      case 'en':
        return 'https://easylocker.drop-point.com/booking-engine/legal?locale=en';
      case 'fr':
        return 'https://easylocker.drop-point.com/booking-engine/legal?locale=fr';
      case 'de':
        return 'https://easylocker.drop-point.com/booking-engine/legal?locale=de';
      case 'it':
        return 'https://easylocker.drop-point.com/booking-engine/legal?locale=it';
      case 'es':
      default:
        return 'https://easylocker.drop-point.com/booking-engine/legal?locale=es';
    }
  }

  onQuickLinkClick(
    linkType: 'email' | 'whatsapp' | 'terms' | 'cookie-policy',
    href: string
  ): void {
    this.analytics.trackEvent('footer_click_quick_link', {
      link_type: linkType,
      href,
    });
  }

  onSocialClick(
    network: 'facebook' | 'instagram' | 'tiktok',
    href: string
  ): void {
    this.analytics.trackEvent('footer_click_social', {
      network,
      href,
    });
  }

  onManageCookies(): void {
    this.showCookiePreferences = true;
    this.analytics.trackEvent('footer_manage_cookies_open');
  }

  onPreferencesClosed(): void {
    this.showCookiePreferences = false;
  }
}
