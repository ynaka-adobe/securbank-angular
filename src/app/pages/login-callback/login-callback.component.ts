import { Component, OnInit, inject } from '@angular/core';
import { OktaAuthService } from '../../core/services/okta-auth.service';

@Component({
  selector: 'app-login-callback',
  standalone: true,
  template: `
    <div class="login-callback">
      <p>Completing sign in...</p>
    </div>
  `,
  styles: [
    `
      .login-callback {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        font-size: 1.125rem;
      }
    `
  ]
})
export class LoginCallbackComponent implements OnInit {
  private readonly oktaAuth = inject(OktaAuthService);

  ngOnInit(): void {
    this.oktaAuth.handleLoginCallback();
  }
}
