import { Component, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent, KeyValuePipe],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  private hardcodedCategories: Record<string, { label: string; href: string }[]> = {
    About: [
      { label: 'Company', href: '/' },
      { label: 'Careers', href: '/' },
      { label: 'FAQ', href: '/' },
      { label: 'Contact Us', href: '/' }
    ]
  };

  categories = computed(() => {
    const articles = this.api.articles();
    const services = this.api.services();
    const map: Record<string, { label: string; href: string }[]> = {};

    if (articles && Array.isArray(articles)) {
      map['Articles'] = articles
        .map((node: unknown) => {
          const n = node as { node?: { title?: string; slug?: string } };
          return {
            label: n.node?.title || '',
            href: `/articles/${n.node?.slug || ''}`
          };
        })
        .filter((a: { label: string }) => a.label);
    }
    if (services && Array.isArray(services)) {
      map['Services'] = services
        .map((node: unknown) => {
          const n = node as { node?: { title?: string; slug?: string } };
          return {
            label: n.node?.title || '',
            href: `/services/${n.node?.slug || ''}`
          };
        })
        .filter((s: { label: string }) => s.label);
    }
    return { ...map, ...this.hardcodedCategories };
  });

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.loadArticles(3);
    this.api.loadServices(3);
  }
}
