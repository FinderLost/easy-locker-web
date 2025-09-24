import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs = [
    { questionKey: 'faq_1_q', answerKey: 'faq_1_a', isOpen: false },
    { questionKey: 'faq_2_q', answerKey: 'faq_2_a', isOpen: false },
    { questionKey: 'faq_3_q', answerKey: 'faq_3_a', isOpen: false }
  ];

  constructor(private translate: TranslateService) {}

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
