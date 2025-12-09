import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  constructor(
    private translate: TranslateService,
    private analytics: AnalyticsService
  ) {}

  onReserve() {
    this.analytics.trackEvent('hero_click_book_now', {
      position: 'hero',
      cta_variant: 'primary',
    });
    this.translate.get('hero.links.reserve').subscribe((link: string) => {
      window.open(link, '_blank');
    });
  }

  onDirections() {
    this.analytics.trackEvent('hero_click_get_directions', {
      position: 'hero',
      destination: 'google_maps',
    });
    this.translate.get('hero.links.maps').subscribe((link: string) => {
      window.open(link, '_blank');
    });
  }
}
