import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  get footerDescriptionHtml(): string {
    const desc = this.translate.instant('footer_description');
    return desc.replace(/\n/g, '<br>');
  }
  currentYear = new Date().getFullYear();
  isDarkMode = false;

  constructor(
    private translate: TranslateService,
    public themeService: ThemeService
  ) {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
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
}
