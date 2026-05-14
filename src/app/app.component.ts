import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AemEmbedComponent } from './shared/components/aem-embed/aem-embed.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AemEmbedComponent],
  template: `
    <div class="app" [class.app--cookie-lab]="cookieLabMinimalShell()">
      @if (!cookieLabMinimalShell()) {
        @if (embedHeaderUrl) {
          <app-aem-embed [url]="embedHeaderUrl" type="header"></app-aem-embed>
        } @else {
          <app-header></app-header>
        }
      }
      <main>
        <router-outlet></router-outlet>
      </main>
      @if (!cookieLabMinimalShell()) {
        @if (embedFooterUrl) {
          <app-aem-embed [url]="embedFooterUrl" type="footer"></app-aem-embed>
        } @else {
          <app-footer></app-footer>
        }
      }
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly router = inject(Router);

  /** No site chrome so /cookie-test fits small/iframed viewports. */
  readonly cookieLabMinimalShell = signal(this.isCookieTestRoute());

  title = 'securbank-angular';
  embedHeaderUrl = environment.aemEmbedHeaderUrl || '';
  embedFooterUrl = environment.aemEmbedFooterUrl || '';

  constructor() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      this.cookieLabMinimalShell.set(this.isCookieTestRoute());
    });
  }

  private isCookieTestRoute(): boolean {
    const tree = this.router.parseUrl(this.router.url);
    const first = tree.root.children['primary']?.segments[0]?.path;
    return first === 'cookie-test';
  }
}
