import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {

  constructor(private translate: TranslateService) {}

  onReserve() {
    this.translate.get('hero_reserve_link').subscribe((link: string) => {
      window.open(link, '_blank');
    });
  }

  onDirections() {
    this.translate.get('hero_maps_link').subscribe((link: string) => {
      window.open(link, '_blank');
    });
  }
}
