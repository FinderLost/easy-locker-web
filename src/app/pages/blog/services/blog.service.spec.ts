import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService]
    });
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate reading time correctly', () => {
    const content = '<p>' + 'word '.repeat(400) + '</p>';
    const readingTime = service.calculateReadingTime(content);
    expect(readingTime).toBe(2); // 400 words / 200 words per minute = 2 minutes
  });

  it('should return all categories', () => {
    const categories = service.getCategories();
    expect(categories.length).toBe(5);
    expect(categories).toContain('guias-turisticas');
  });
});
