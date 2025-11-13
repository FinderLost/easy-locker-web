import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs = [
    { questionKey: 'faq_q1', answerKey: 'faq_a1', isOpen: false },
    { questionKey: 'faq_q2', answerKey: 'faq_a2', isOpen: false },
    { questionKey: 'faq_q3', answerKey: 'faq_a3', isOpen: false },
    { questionKey: 'faq_q4', answerKey: 'faq_a4', isOpen: false },
    { questionKey: 'faq_q5', answerKey: 'faq_a5', isOpen: false },
    { questionKey: 'faq_q6', answerKey: 'faq_a6', isOpen: false },
    { questionKey: 'faq_q7', answerKey: 'faq_a7', isOpen: false },
    { questionKey: 'faq_q8', answerKey: 'faq_a8', isOpen: false },
    { questionKey: 'faq_q9', answerKey: 'faq_a9', isOpen: false }
  ];

  constructor(private translate: TranslateService) {}

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
