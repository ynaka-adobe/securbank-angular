import { Component, Input } from '@angular/core';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ContainerComponent } from '../../../../shared/components/base/container/container.component';

@Component({
  selector: 'app-articles-section',
  standalone: true,
  imports: [ArticleCardComponent],
  templateUrl: './articles-section.component.html',
  styleUrls: ['./articles-section.component.scss']
})
export class ArticlesSectionComponent {
  @Input() title = '';
  @Input() cfs: unknown[] = [];
  @Input() containerProps: Record<string, unknown> = {};
  @Input() columns = 2;
}
