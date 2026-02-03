import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
    pathMatch: 'full'
  },
  {
    path: ':category',
    component: BlogListComponent
  },
  {
    path: 'articulo/:slug',
    component: BlogPostComponent
  },
  {
    path: 'article/:slug',
    component: BlogPostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {}
