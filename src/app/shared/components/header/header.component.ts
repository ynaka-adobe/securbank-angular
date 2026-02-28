import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { RedirectButtonComponent } from '../redirect-button/redirect-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent, RedirectButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  navigations = [
    { label: 'Services', href: '/services' },
    { label: 'Articles', href: '/articles' }
  ];
  isAuthenticated = false;
  userName: string | null = null;
}
