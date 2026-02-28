import { Injectable, signal } from '@angular/core';
import { AemService } from './aem.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private aem: AemService) {}

  private async fetchPersistedQuery(queryName: string, params?: Record<string, unknown>): Promise<{ data?: unknown; err?: string }> {
    try {
      const response = await this.aem.runPersistedQuery(queryName, params);
      return { data: response?.data };
    } catch (e: unknown) {
      const err = e instanceof Error ? (e as unknown as { toJSON?: () => { message?: string } }).toJSON?.()?.message : String(e);
      return { err: err || 'Unknown error' };
    }
  }

  pageBySlug = signal<unknown>(null);
  async loadPageBySlug(slug: string, variation = 'master'): Promise<unknown> {
    const response = await this.fetchPersistedQuery('page-by-slug', { slug, variation });
    if (response?.err) return null;
    const items = (response?.data as { pageList?: { items?: unknown[] } })?.pageList?.items;
    this.pageBySlug.set(items?.length === 1 ? items[0] : null);
    return this.pageBySlug();
  }

  articleBySlug = signal<unknown>(null);
  async loadArticleBySlug(slug: string): Promise<unknown> {
    const response = await this.fetchPersistedQuery('article-by-slug', { slug });
    if (response?.err) return null;
    const items = (response?.data as { articleList?: { items?: unknown[] } })?.articleList?.items;
    this.articleBySlug.set(items?.length === 1 ? items[0] : null);
    return this.articleBySlug();
  }

  serviceBySlug = signal<unknown>(null);
  async loadServiceBySlug(slug: string): Promise<unknown> {
    const response = await this.fetchPersistedQuery('service-by-slug', { slug });
    if (response?.err) return null;
    const items = (response?.data as { serviceList?: { items?: unknown[] } })?.serviceList?.items;
    this.serviceBySlug.set(items?.length === 1 ? items[0] : null);
    return this.serviceBySlug();
  }

  articles = signal<unknown[] | null>(null);
  async loadArticles(first?: number): Promise<unknown[] | null> {
    const params = first ? { first } : {};
    const response = await this.fetchPersistedQuery('articles', params);
    if (response?.err) return null;
    const edges = (response?.data as { articlePaginated?: { edges?: unknown[] } })?.articlePaginated?.edges;
    const data = edges ?? null;
    this.articles.set(data);
    return data;
  }

  services = signal<unknown[] | null>(null);
  async loadServices(first?: number): Promise<unknown[] | null> {
    const params = first ? { first } : {};
    const response = await this.fetchPersistedQuery('services', params);
    if (response?.err) return null;
    const edges = (response?.data as { servicePaginated?: { edges?: unknown[] } })?.servicePaginated?.edges;
    const data = edges ?? null;
    this.services.set(data);
    return data;
  }
}
