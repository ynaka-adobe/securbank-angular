import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule],
  template: '<div [class]="className" data-aue-type="container" [attr.data-aue-prop]="prop" [attr.data-aue-label]="label" [attr.data-aue-filter]="filter"><ng-content></ng-content></div>'
})
export class ContainerComponent {
  @Input() tag = 'div';
  @Input() className = '';
  @Input() prop = '';
  @Input() label = '';
  @Input() filter = '';
}
