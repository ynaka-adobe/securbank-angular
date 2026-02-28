import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuth, AuthState } from '@okta/okta-auth-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OktaAuthState {
  isAuthenticated: boolean;
  idToken?: { claims?: { name?: string; email?: string; preferred_username?: string } };
}

@Injectable({ providedIn: 'root' })
export class OktaAuthService {
  private readonly router = inject(Router);
  private oktaAuth: OktaAuth | null = null;
  private authStateSubject = new BehaviorSubject<OktaAuthState>({
    isAuthenticated: false
  });

  authState$ = this.authStateSubject.asObservable();

  get isOktaEnabled(): boolean {
    return !!(environment.oktaIssuer && environment.oktaClientId);
  }

  get oktaAuthInstance(): OktaAuth | null {
    return this.oktaAuth;
  }

  constructor() {
    if (this.isOktaEnabled) {
      const scopes = environment.oktaScopes
        ? environment.oktaScopes.split(' ').filter(Boolean)
        : ['openid', 'profile', 'email'];

      // Use current origin for redirect when on localhost so local dev works without env changes
      const redirectUri =
        typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? `${window.location.origin}/login/callback`
          : (environment.oktaRedirectUri || (typeof window !== 'undefined' ? `${window.location.origin}/login/callback` : '/login/callback'));

      this.oktaAuth = new OktaAuth({
        issuer: environment.oktaIssuer!,
        clientId: environment.oktaClientId!,
        redirectUri,
        scopes,
        pkce: true,
        tokenManager: {
          autoRenew: true,
          storage: 'sessionStorage'
        },
        restoreOriginalUri: async (_oktaAuth, originalUri) => {
          const target = originalUri || '/';
          await this.router.navigateByUrl(target);
        }
      });

      this.oktaAuth.authStateManager.subscribe((authState: AuthState) => {
        this.authStateSubject.next(this.toOktaAuthState(authState));
      });

      const initialState = this.oktaAuth.authStateManager.getAuthState();
      if (initialState) {
        this.authStateSubject.next(this.toOktaAuthState(initialState));
      }
    }
  }

  private toOktaAuthState(authState: AuthState): OktaAuthState {
    return {
      isAuthenticated: !!authState?.isAuthenticated,
      idToken: authState?.idToken as OktaAuthState['idToken']
    };
  }

  async signIn(): Promise<void> {
    if (!this.oktaAuth) return;

    const isInIframe = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

    if (isInIframe) {
      try {
        const { tokens } = await this.oktaAuth.token.getWithPopup({
          scopes: ['openid', 'profile', 'email']
        });
        this.oktaAuth.tokenManager.setTokens(tokens);
      } catch (err: unknown) {
        const error = err as { name?: string };
        if (error.name !== 'UserCancelledError') {
          window.top!.location.href = `${window.location.origin}/login/callback`;
        }
      }
    } else {
      const originalUri = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
      this.oktaAuth.setOriginalUri(originalUri);
      await this.oktaAuth.signInWithRedirect();
    }
  }

  async signOut(): Promise<void> {
    if (this.oktaAuth) {
      await this.oktaAuth.signOut();
    }
  }

  async handleLoginCallback(): Promise<void> {
    if (!this.oktaAuth) return Promise.resolve();

    return this.oktaAuth.handleLoginRedirect();
  }

  getOriginalUri(): string | undefined {
    return this.oktaAuth?.getOriginalUri();
  }

  setOriginalUri(uri: string): void {
    this.oktaAuth?.setOriginalUri(uri);
  }
}
