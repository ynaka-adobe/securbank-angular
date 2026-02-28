import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  standalone: true,
  template: '<a routerLink="/" class="logo hover-effect" [class.light]="variant === \'light\'" [class.dark]="variant === \'dark\'" aria-label="SecurBank Home"><span class="logo-text">SecurBank</span></a>',
  styles: [`
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-text {
      font-weight: 600;
      font-size: 20px;
      letter-spacing: -0.02em;
    }
    .logo.light .logo-text {
      color: #ffffff;
    }
    .logo.dark .logo-text {
      color: #1e293b;
    }
  `]
})
export class LogoComponent {
  @Input() variant: 'light' | 'dark' = 'light';
}
