import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  template: '<h1 [class]="className" [attr.data-aue-prop]="prop" data-aue-type="text" [attr.data-aue-label]="displayLabel"><ng-content></ng-content></h1>'
})
export class TitleComponent {
  @Input() heading: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
  @Input() className = '';
  @Input() prop = '';
  @Input() label = '';
  @Input() behavior = '';

  get displayLabel(): string {
    return this.label || (this.prop ? this.prop[0].toUpperCase() + this.prop.slice(1) : '');
  }
}
