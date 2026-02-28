import { Component, Input } from '@angular/core';
import { TitleComponent } from '../../../../shared/components/base/title/title.component';
import { ImageComponent } from '../../../../shared/components/base/image/image.component';
import { TextComponent } from '../../../../shared/components/base/text/text.component';
import { RedirectButtonComponent } from '../../../../shared/components/redirect-button/redirect-button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TitleComponent, ImageComponent, TextComponent, RedirectButtonComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() image = '';
  @Input() title = '';
  @Input() content: { plaintext?: string; html?: string } | null = null;
}
