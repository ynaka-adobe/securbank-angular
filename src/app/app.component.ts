import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
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
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  /** No site chrome so /cookie-test fits small/iframed viewports. */
  readonly cookieLabMinimalShell = signal(this.isCookieTestRoute());

  title = 'securbank-angular';
  embedHeaderUrl = environment.aemEmbedHeaderUrl || '';
  embedFooterUrl = environment.aemEmbedFooterUrl || '';

  constructor() {
    this.installUniversalEditor();
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      this.cookieLabMinimalShell.set(this.isCookieTestRoute());
    });
  }

  /**
   * Universal Editor (same pattern as SecurBank React):
   * CORS helper + AEM connection meta pointing at author (or "/" when using local proxy).
   * @see https://github.com/ynakagawa/SecurBank
   */
  private installUniversalEditor(): void {
    const aemConnectionUrl = environment.useProxy ? '/' : environment.hostUri;
    this.meta.updateTag({
      name: 'urn:adobe:aue:system:aemconnection',
      content: `aem:${aemConnectionUrl}`
    });

    const head = this.document.head;
    if (head.querySelector('script[data-aem-ue-cors]')) {
      return;
    }
    const script = this.document.createElement('script');
    script.src = 'https://universal-editor-service.adobe.io/cors.js';
    script.async = true;
    script.setAttribute('data-aem-ue-cors', 'true');
    head.appendChild(script);
  }

  private isCookieTestRoute(): boolean {
    const tree = this.router.parseUrl(this.router.url);
    const first = tree.root.children['primary']?.segments[0]?.path;
    return first === 'cookie-test';
  }
}
