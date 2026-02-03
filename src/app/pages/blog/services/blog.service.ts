import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BlogPost, BlogCategory, Language } from '../models/blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private postsCache$?: Observable<BlogPost[]>;
  private readonly dataUrl = '/assets/data/blog-posts.json';

  constructor(private http: HttpClient) {}

  getPosts(filters?: {
    category?: BlogCategory;
    tag?: string;
    lang?: Language;
    featured?: boolean;
    limit?: number;
  }): Observable<BlogPost[]> {
    if (!this.postsCache$) {
      this.postsCache$ = this.http.get<{ posts: any[] }>(this.dataUrl).pipe(
        map(data => data.posts.map(post => this.parsePost(post))),
        shareReplay(1)
      );
    }

    return this.postsCache$.pipe(
      map(posts => {
        let filtered = posts.filter(p => p.status === 'published');

        if (filters?.category) {
          filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters?.tag) {
          filtered = filtered.filter(p => p.tags.includes(filters.tag || ''));
        }

        if (filters?.featured !== undefined) {
          filtered = filtered.filter(p => p.featured === filters.featured);
        }

        if (filters?.limit) {
          filtered = filtered.slice(0, filters.limit);
        }

        return filtered;
      })
    );
  }

  getPostBySlug(slug: string, lang: Language): Observable<BlogPost | null> {
    return this.getPosts().pipe(
      map(posts => {
        const post = posts.find(p => p.slug[lang] === slug);
        return post || null;
      })
    );
  }

  getRelatedPosts(postId: string, limit: number = 3): Observable<BlogPost[]> {
    return this.getPosts().pipe(
      map(posts => {
        const currentPost = posts.find(p => p.id === postId);
        if (!currentPost || !currentPost.relatedPosts) {
          return [];
        }

        return posts
          .filter(p => currentPost.relatedPosts!.includes(p.id))
          .slice(0, limit);
      })
    );
  }

  getCategories(): BlogCategory[] {
    return [
      'guias-turisticas',
      'consejos-viaje',
      'eventos-cordoba',
      'gastronomia',
      'historia-cultura'
    ];
  }

  calculateReadingTime(content: string): number {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }

  private parsePost(data: any): BlogPost {
    return {
      ...data,
      publishedAt: new Date(data.publishedAt),
      updatedAt: new Date(data.updatedAt)
    };
  }
}
