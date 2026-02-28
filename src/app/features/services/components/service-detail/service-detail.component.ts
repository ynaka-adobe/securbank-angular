import { Component, Input, OnInit } from '@angular/core';
import { ImageComponent } from '../../../../shared/components/base/image/image.component';
import { TitleComponent } from '../../../../shared/components/base/title/title.component';
import { TextComponent } from '../../../../shared/components/base/text/text.component';
import { RedirectButtonComponent } from '../../../../shared/components/redirect-button/redirect-button.component';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [ImageComponent, TitleComponent, TextComponent, RedirectButtonComponent],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  @Input() slug = '';
  data: Record<string, unknown> | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.loadServiceBySlug(this.slug).then(d => {
      this.data = d as Record<string, unknown> | null;
      if (this.data) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });
  }

  get image(): string {
    const icon = this.data?.['icon'] as { _dynamicUrl?: string } | undefined;
    return icon?._dynamicUrl || '';
  }

  get title(): string {
    return (this.data?.['title'] as string) || '';
  }

  get content(): { plaintext?: string; html?: string } | null {
    return (this.data?.['description'] as { plaintext?: string; html?: string }) || null;
  }

  get category(): string {
    return (this.data?.['serviceCategory'] as { name?: string })?.name || '';
  }
}
