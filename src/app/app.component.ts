import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AemEmbedComponent } from './shared/components/aem-embed/aem-embed.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AemEmbedComponent],
  template: `
    <div class="app">
      @if (embedHeaderUrl) {
        <app-aem-embed [url]="embedHeaderUrl" type="header"></app-aem-embed>
      } @else {
        <app-header></app-header>
      }
      <main>
        <router-outlet></router-outlet>
      </main>
      @if (embedFooterUrl) {
        <app-aem-embed [url]="embedFooterUrl" type="footer"></app-aem-embed>
      } @else {
        <app-footer></app-footer>
      }
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'securbank-angular';
  embedHeaderUrl = environment.aemEmbedHeaderUrl || '';
  embedFooterUrl = environment.aemEmbedFooterUrl || '';
}
