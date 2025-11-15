import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  public getTitleHtml(key: string): string {
    return this.translate.instant(key).replace(/\n/g, '<br>');
  }
  plans = [
    {
      imageKey: 'pricing_plan1_image',
      titleKey: 'pricing_plan1_title',
      descriptionKey: 'pricing_plan1_description',
      featured: false
    },
    {
      imageKey: 'pricing_plan2_image',
      titleKey: 'pricing_plan2_title',
      descriptionKey: 'pricing_plan2_description',
      featured: true
    },
    {
      imageKey: 'pricing_plan3_image',
      titleKey: 'pricing_plan3_title',
      descriptionKey: 'pricing_plan3_description',
      featured: false
    }
  ];

  constructor(private translate: TranslateService) {}

  onReserve() {
    this.translate.get('pricing_reserve_link').subscribe((link: string) => {
      window.open(link, '_blank');
    });
  }
}
