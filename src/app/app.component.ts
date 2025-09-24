import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'easy-locker-angular';

  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang('es');
  }

  ngOnInit() {
    // Initialize language from localStorage or use default
    const savedLanguage = localStorage.getItem('language') || 'es';
    this.translate.use(savedLanguage);
  }
}
