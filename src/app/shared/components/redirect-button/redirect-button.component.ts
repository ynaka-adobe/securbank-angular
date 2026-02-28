import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-redirect-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (customClick) {
      <button type="button" class="button hover-effect" [class.secondary]="className === 'secondary'" [class.transparent]="className === 'transparent'" [attr.aria-label]="ariaLabel || label" (click)="clicked.emit()">
        {{ label || '' }}<ng-content></ng-content>
      </button>
    } @else {
      <a [routerLink]="href" [queryParams]="queryParams" class="button hover-effect" [class.secondary]="className === 'secondary'" [class.transparent]="className === 'transparent'" [attr.aria-label]="ariaLabel || label"><ng-content></ng-content></a>
    }
  `,
  styleUrls: ['./redirect-button.component.scss']
})
export class RedirectButtonComponent {
  @Input() href = '/';
  @Input() className = '';
  @Input() label = '';
  @Input() ariaLabel = '';
  @Input() queryParams: Record<string, string> = {};
  @Input() customClick = false;
  @Output() clicked = new EventEmitter<void>();
}
