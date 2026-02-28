import { Component, Input } from '@angular/core';
import { ImageComponent } from '../../../../../shared/components/base/image/image.component';
import { ContentFragmentComponent } from '../../../../../shared/components/base/content-fragment/content-fragment.component';
import { TitleComponent } from '../../../../../shared/components/base/title/title.component';
import { TextComponent } from '../../../../../shared/components/base/text/text.component';
import { RedirectButtonComponent } from '../../../../../shared/components/redirect-button/redirect-button.component';

@Component({
  selector: 'app-teaser-card',
  standalone: true,
  imports: [ImageComponent, ContentFragmentComponent, TitleComponent, TextComponent, RedirectButtonComponent],
  templateUrl: './teaser-card.component.html',
  styleUrls: ['./teaser-card.component.scss']
})
export class TeaserCardComponent {
  @Input() cf: Record<string, unknown> = {};
  @Input() index = 0;

  get image(): string {
    const icon = this.cf?.['icon'] as { _dynamicUrl?: string } | undefined;
    return icon?._dynamicUrl || '';
  }

  get title(): string {
    return (this.cf?.['title'] as string) || '';
  }

  get content(): { plaintext?: string; html?: string } | null {
    return (this.cf?.['description'] as { plaintext?: string; html?: string }) || null;
  }

  get path(): string {
    return '/services/' + (this.cf?.['slug'] as string || '');
  }
}
