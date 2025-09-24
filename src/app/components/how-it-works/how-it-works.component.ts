import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent {
  steps = [
    { icon: '🧳', textKey: 'how_choose' },
    { icon: '💳', textKey: 'how_pay' },
    { icon: '📦', textKey: 'how_pickup' }
  ];

  constructor(private translate: TranslateService) {}
}
