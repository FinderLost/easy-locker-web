import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'politica-cookies', component: CookiePolicyComponent },
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
