import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';
import { COOKIE_POLICY_SLUGS } from './core/models/cookie-policy-routing';
import { LanguageRedirectComponent } from './pages/language-redirect/language-redirect.component';
import { LanguageRouteGuard } from './core/guards/language-route.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LanguageRedirectComponent },
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
  {
    path: ':lang/blog',
    loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule),
    canActivate: [LanguageRouteGuard],
  },
  {
    path: ':lang',
    component: HomeComponent,
    canActivate: [LanguageRouteGuard],
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
