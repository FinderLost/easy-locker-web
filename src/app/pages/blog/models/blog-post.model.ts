export type Language = 'es' | 'en' | 'fr' | 'de' | 'it' | 'ja' | 'ko';

export type BlogCategory = 
  | 'guias-turisticas'
  | 'consejos-viaje'
  | 'eventos-cordoba'
  | 'gastronomia'
  | 'historia-cultura';

export interface BlogPost {
  id: string;
  title: Record<Language, string>;
  slug: Record<Language, string>;
  excerpt: Record<Language, string>;
  content: Record<Language, string>;
  metaTitle: Record<Language, string>;
  metaDescription: Record<Language, string>;
  keywords: Record<Language, string[]>;
  category: BlogCategory;
  tags: string[];
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  readingTimeMinutes: number;
  featuredImage: {
    url: string;
    alt: Record<Language, string>;
    width: number;
    height: number;
    credit?: string;
  };
  relatedPosts?: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}
