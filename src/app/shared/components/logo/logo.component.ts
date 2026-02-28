import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  standalone: true,
  template: '<a routerLink="/" class="logo hover-effect" aria-label="SecurBank Home"><span class="logo-text">SecurBank</span></a>',
  styles: ['.logo { display: flex; align-items: center; gap: 8px; } .logo-text { font-weight: 600; font-size: 18px; }']
})
export class LogoComponent {
  @Input() variant: 'light' | 'dark' = 'light';
}
