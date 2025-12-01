import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { HomeComponent } from './pages/home/home.component';
import { AccessGuard } from './guards/access.guard';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AccessGuard] },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'politica-cookies', component: CookiePolicyComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
