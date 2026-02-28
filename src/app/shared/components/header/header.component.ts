import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogoComponent } from '../logo/logo.component';
import { RedirectButtonComponent } from '../redirect-button/redirect-button.component';
import { OktaAuthService } from '../../../core/services/okta-auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent, RedirectButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  navigations = [
    { label: 'Services', href: '/services' },
    { label: 'Articles', href: '/articles' }
  ];
  isAuthenticated = false;
  userName: string | null = null;
  isOktaEnabled = false;
  private authSub?: Subscription;

  constructor(private readonly oktaAuth: OktaAuthService) {}

  ngOnInit(): void {
    this.isOktaEnabled = this.oktaAuth.isOktaEnabled;
    if (this.isOktaEnabled) {
      this.authSub = this.oktaAuth.authState$.subscribe((state) => {
        this.isAuthenticated = state.isAuthenticated;
        const claims = state.idToken?.claims;
        this.userName =
          claims?.name ?? claims?.email ?? claims?.preferred_username ?? null;
      });
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  signIn(): void {
    this.oktaAuth.signIn();
  }

  signOut(): void {
    this.oktaAuth.signOut();
  }
}
