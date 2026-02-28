import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-redirect-button',
  standalone: true,
  imports: [RouterLink],
  template: '<a [routerLink]="href" [queryParams]="queryParams" class="button hover-effect" [class.secondary]="className === \'secondary\'" [class.transparent]="className === \'transparent\'" [attr.aria-label]="ariaLabel"><ng-content></ng-content></a>'
})
export class RedirectButtonComponent {
  @Input() href = '/';
  @Input() className = '';
  @Input() ariaLabel = '';
  @Input() queryParams: Record<string, string> = {};
}
