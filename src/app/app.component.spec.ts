import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AnalyticsService } from './core/analytics/analytics.service';

class AnalyticsServiceStub {
  // no-op stub to satisfy injections in language/theme services
  trackEvent(): void {}
}

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      declarations: [AppComponent],
      providers: [{ provide: AnalyticsService, useClass: AnalyticsServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
