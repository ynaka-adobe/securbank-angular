import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageComponent } from '../../../../shared/components/base/image/image.component';
import { TitleComponent } from '../../../../shared/components/base/title/title.component';
import { TextComponent } from '../../../../shared/components/base/text/text.component';
import { ContentFragmentComponent } from '../../../../shared/components/base/content-fragment/content-fragment.component';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [ImageComponent, TitleComponent, TextComponent, ContentFragmentComponent],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() cf: Record<string, unknown> = {};
  @Input() navigate: (path: string) => void = () => {};

  constructor(private router: Router) {}

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

  get category(): string {
    return (this.cf?.['serviceCategory'] as { name?: string })?.name || '';
  }

  get path(): string {
    return '/services/' + (this.cf?.['slug'] as string || '');
  }

  goTo(path: string): void {
    if (this.navigate) {
      this.navigate(path);
    } else {
      this.router.navigateByUrl(path);
    }
  }
}
