import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  template: '<p *ngIf="hasPlaintext" [class]="className" [attr.data-aue-prop]="prop" [attr.data-aue-label]="displayLabel">{{ content?.plaintext }}</p><div *ngIf="hasHtml && !hasPlaintext" [class]="className" [attr.data-aue-prop]="prop" [attr.data-aue-label]="displayLabel" [innerHTML]="content?.html"></div><ng-content *ngIf="!hasPlaintext && !hasHtml"></ng-content>'
})
export class TextComponent {
  @Input() content: { plaintext?: string; html?: string } | null = null;
  @Input() className = '';
  @Input() prop = '';
  @Input() label = '';
  @Input() behavior = '';

  get hasPlaintext(): boolean {
    return !!(this.content?.plaintext);
  }

  get hasHtml(): boolean {
    return !!(this.content?.html);
  }

  get displayLabel(): string {
    return this.label || (this.prop ? this.prop[0].toUpperCase() + this.prop.slice(1) : '');
  }
}
