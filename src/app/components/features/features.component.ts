import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  features = [
    { icon: '⏰', textKey: 'features_24h' },
    { icon: '🔒', textKey: 'features_security' },
    { icon: '💶', textKey: 'features_price' },
    { icon: '📲', textKey: 'features_online' },
    { icon: '🚪', textKey: 'features_nolines' }
  ];

  constructor(private translate: TranslateService) {}
}
