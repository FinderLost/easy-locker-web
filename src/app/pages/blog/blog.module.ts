import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';

@NgModule({
  declarations: [
    BlogListComponent,
    BlogPostComponent,
    BlogCardComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    TranslateModule
  ]
})
export class BlogModule {}
