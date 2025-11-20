import { Component, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'easy-locker-angular';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.init();
  }
}
