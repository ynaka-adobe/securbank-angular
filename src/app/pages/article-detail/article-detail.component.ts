import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageComponent } from '../../shared/components/base/image/image.component';
import { TitleComponent } from '../../shared/components/base/title/title.component';
import { TextComponent } from '../../shared/components/base/text/text.component';
import { ArticlesSectionComponent } from '../../features/articles/components/articles-section/articles-section.component';
import { CallToActionSectionComponent } from '../../features/home/components/call-to-action-section/call-to-action-section.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    ImageComponent,
    TitleComponent,
    TextComponent,
    ArticlesSectionComponent,
    CallToActionSectionComponent
  ],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  data: Record<string, unknown> | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.api.loadArticleBySlug(slug).then(d => {
        this.data = d as Record<string, unknown> | null;
      });
    }
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
}
