import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';
import { COOKIE_POLICY_SLUGS } from './core/models/cookie-policy-routing';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: COOKIE_POLICY_SLUGS['es'],
    component: CookiePolicyComponent,
    data: { cookieLang: 'es' },
    pathMatch: 'full',
  },
  {
    path: COOKIE_POLICY_SLUGS['en'],
    component: CookiePolicyComponent,
    data: { cookieLang: 'en' },
    pathMatch: 'full',
  },
  {
    path: COOKIE_POLICY_SLUGS['fr'],
    component: CookiePolicyComponent,
    data: { cookieLang: 'fr' },
    pathMatch: 'full',
  },
  {
    path: COOKIE_POLICY_SLUGS['de'],
    component: CookiePolicyComponent,
    data: { cookieLang: 'de' },
    pathMatch: 'full',
  },
  {
    path: COOKIE_POLICY_SLUGS['it'],
    component: CookiePolicyComponent,
    data: { cookieLang: 'it' },
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
