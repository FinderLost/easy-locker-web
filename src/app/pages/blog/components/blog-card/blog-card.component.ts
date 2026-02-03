import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BlogPost, Language } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent {
  @Input() post!: BlogPost;
  @Input() lang: Language = 'es';

  constructor(private router: Router) {}

  onCardClick(): void {
    const articleSlug = this.lang === 'es' ? 'articulo' : 'article';
    this.router.navigate([`/${this.lang}/blog/${articleSlug}/${this.post.slug[this.lang]}`]);
  }

  getCategoryLabel(): string {
    const labels: Record<string, Partial<Record<Language, string>>> = {
      'guias-turisticas': { es: 'Guías turísticas', en: 'Travel Guides' },
      'consejos-viaje': { es: 'Consejos de viaje', en: 'Travel Tips' },
      'eventos-cordoba': { es: 'Eventos en Córdoba', en: 'Events in Córdoba' },
      'gastronomia': { es: 'Gastronomía', en: 'Gastronomy' },
      'historia-cultura': { es: 'Historia y cultura', en: 'History & Culture' }
    };
    return labels[this.post.category]?.[this.lang] || this.post.category;
  }
}
