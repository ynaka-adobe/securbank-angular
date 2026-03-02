import { Component, OnInit, OnDestroy, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { SelectorButtonComponent } from '../../shared/components/selector-button/selector-button.component';
import { TeaserSectionComponent } from '../../features/home/components/teaser-section/teaser-section.component';
import { CallToActionSectionComponent } from '../../features/home/components/call-to-action-section/call-to-action-section.component';
import { HeroComponent } from '../../features/home/components/hero/hero.component';
import { AemEmbedComponent } from '../../shared/components/aem-embed/aem-embed.component';
import { ApiService } from '../../core/services/api.service';
import { snakeCaseToTitleCase } from '../../shared/utils/snake-case-to-title-case';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    KeyValuePipe,
    SelectorButtonComponent,
    HeroComponent,
    AemEmbedComponent,
    TeaserSectionComponent,
    CallToActionSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);

  data: Record<string, unknown> | null = null;
  categories: Record<string, string> = { master: 'Personal Banking' };
  selectedVariation = 'master';
  private scrollHandler = () => {
    const el = document.getElementById('parallax-item');
    if (el) {
      const scrollPosition = window.scrollY;
      const opacity = 1 - (scrollPosition / window.innerHeight) * 4;
      const initialTopPosition = 650;
      const scrollSpeed = 0.6;
      el.style.top = initialTopPosition + scrollPosition * scrollSpeed + 'px';
      el.style.opacity = String(opacity);
    }
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedVariation = params['variation'] || 'master';
      if (!params['variation']) {
        this.router.navigate(['/'], { queryParams: { variation: 'master' } });
      }
      this.loadPage();
    });
    document.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this.scrollHandler);
  }

  private loadPage(): void {
    this.api.loadPageBySlug('home', this.selectedVariation).then(page => {
      this.data = page as Record<string, unknown> | null;
      if (this.data) {
        const variations = this.data['_variations'] as string[] | undefined;
        if (variations) {
          for (const v of variations) {
            this.categories[v] = snakeCaseToTitleCase(v);
          }
        }
      }
    });
  }

  selectVariation(variation: string): void {
    this.router.navigate(['/'], { queryParams: { variation } });
  }

  get image(): string {
    const img = this.data?.['image'] as { _dynamicUrl?: string } | undefined;
    return img?._dynamicUrl || '';
  }

  get title(): string {
    return (this.data?.['title'] as string) || '';
  }

  get content(): { plaintext?: string; html?: string } | null {
    return (this.data?.['content'] as { plaintext?: string; html?: string }) || null;
  }

  get featuredServices(): unknown[] {
    return (this.data?.['featuredServices'] as unknown[]) || [];
  }

  /** Banner embed URL from page data (variation-specific). Fallbacks when not in CMS. */
  get bannerUrl(): string {
    const raw = this.data?.['bannerUrl'] ?? this.data?.['banner'];
    if (typeof raw === 'string') return raw;
    const obj = raw as { _dynamicUrl?: string } | undefined;
    if (obj?._dynamicUrl) return obj._dynamicUrl;
    if (this.selectedVariation === 'master') {
      return 'https://main--embed-example--aemsites.aem.page/banners/banner1';
    }
    if (this.selectedVariation === 'investment_services') {
      return 'https://main--embed-example--aemsites.aem.page/banners/banner2';
    }
    if (this.selectedVariation === 'business_banking') {
      return 'https://main--embed-example--aemsites.aem.page/banners/banner3';
    }
    return '';
  }
}
