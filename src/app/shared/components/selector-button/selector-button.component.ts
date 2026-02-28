import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector-button',
  standalone: true,
  imports: [CommonModule],
  template: '<button type="button" class="selector-button" [class.selected]="isSelected" [class]="variant" (click)="onClick.emit()"><ng-content></ng-content></button>',
  styleUrls: ['./selector-button.component.scss']
})
export class SelectorButtonComponent {
  @Input() variant = '';
  @Input() isSelected = false;
  @Output() onClick = new EventEmitter<void>();
}
