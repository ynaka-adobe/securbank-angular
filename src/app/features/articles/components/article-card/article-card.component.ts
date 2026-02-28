import { Component, Input } from '@angular/core';
import { ImageComponent } from '../../../../shared/components/base/image/image.component';
import { TitleComponent } from '../../../../shared/components/base/title/title.component';
import { ContentFragmentComponent } from '../../../../shared/components/base/content-fragment/content-fragment.component';
import { RedirectButtonComponent } from '../../../../shared/components/redirect-button/redirect-button.component';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [ImageComponent, TitleComponent, ContentFragmentComponent, RedirectButtonComponent],
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() cf: Record<string, unknown> = {};

  get image(): string {
    const img = this.cf?.['image'] as { _dynamicUrl?: string } | undefined;
    return img?._dynamicUrl || '';
  }

  get title(): string {
    return (this.cf?.['title'] as string) || '';
  }

  get path(): string {
    return '/articles/' + (this.cf?.['slug'] as string || '');
  }
}
