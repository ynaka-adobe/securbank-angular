import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  standalone: true,
  template: '<a routerLink="/" class="logo logo-wrapper" [class.light]="variant === \'light\'" [class.dark]="variant === \'dark\'" aria-label="SecurBank Home"><img src="/static/media/SecurBank-icon-light.svg" alt="SecurBank icon" class="icon"><h5 class="logo-text">SecurBank</h5></a>',
  styles: [`
    .logo-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transform-origin: left center;
      transition: transform 0.4s cubic-bezier(0.47, 0, 0.23, 1.38);
    }
    .logo-wrapper:hover {
      transform: scale(1.11);
    }
    .logo-wrapper .logo-text {
      display: inline;
    }
    .icon {
      width: 18px;
      height: 26px;
      flex-shrink: 0;
    }
    .logo-text {
      font-weight: 600;
      font-size: 32px;
      letter-spacing: -0.02em;
      margin: 0;
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
