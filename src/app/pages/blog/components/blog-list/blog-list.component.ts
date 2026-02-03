import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService } from '../../services/blog.service';
import { BlogPost, BlogCategory, Language } from '../../models/blog-post.model';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {
  posts$!: Observable<BlogPost[]>;
  currentLang: Language = 'es';
  selectedCategory?: BlogCategory;
  private destroy$ = new Subject<void>();

  constructor(
    private blogService: BlogService,
    private languageService: LanguageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentLang = this.languageService.getCurrentLanguage() as Language;

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedCategory = params['category'] as BlogCategory;
      this.loadPosts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPosts(): void {
    this.posts$ = this.blogService.getPosts({
      category: this.selectedCategory
    });
  }

  trackByPostId(index: number, post: BlogPost): string {
    return post.id;
  }
}
