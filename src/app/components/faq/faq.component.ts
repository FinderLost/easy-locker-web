import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs = [
    { questionKey: 'faq_1_q', answerKey: 'faq_1_a' },
    { questionKey: 'faq_2_q', answerKey: 'faq_2_a' },
    { questionKey: 'faq_3_q', answerKey: 'faq_3_a' }
  ];

  constructor(private translate: TranslateService) {}
}
