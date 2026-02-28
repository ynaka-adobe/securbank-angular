import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getURI } from '../../../utils/get-uri';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  template: '<img [src]="imageSrc" [alt]="alt" [class]="className" [attr.width]="width ?? null" [attr.height]="height ?? null" [style.width.px]="width ?? null" [style.height.px]="height ?? null" [style.object-fit]="width && height ? objectFit : null" [attr.data-aue-prop]="prop" [attr.data-aue-type]="type || \'media\'" [attr.data-aue-label]="displayLabel" />'
})
export class ImageComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() className = '';
  @Input() prop = '';
  @Input() type = 'media';
  @Input() label = '';
  @Input() behavior = '';
  @Input() width?: number;
  @Input() height?: number;
  @Input() objectFit: 'fill' | 'contain' | 'cover' | 'none' = 'cover';

  get imageSrc(): string {
    return getURI(this.src, { width: this.width, height: this.height });
  }

  get displayLabel(): string {
    return this.label || (this.prop ? this.prop[0].toUpperCase() + this.prop.slice(1) : '');
  }
}
