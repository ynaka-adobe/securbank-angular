import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TeaserCardComponent } from './teaser-card/teaser-card.component';
import { ContainerComponent } from '../../../../shared/components/base/container/container.component';

@Component({
  selector: 'app-teaser-section',
  standalone: true,
  imports: [TeaserCardComponent, ContainerComponent],
  templateUrl: './teaser-section.component.html',
  styleUrls: ['./teaser-section.component.scss']
})
export class TeaserSectionComponent {
  @Input() title = '';
  @Input() cfs: unknown[] = [];
  @Input() containerProps: Record<string, unknown> = {};
  @Output() fetchTrigger = new EventEmitter<void>();
}
