import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/**
 * Wrapper for the AEM Embed web component.
 * Embeds content from an AEM Edge Delivery / AEM.live project.
 * @see https://www.aem.live/docs/aem-embed
 */
@Component({
  selector: 'app-aem-embed',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<aem-embed [attr.url]="url" [attr.type]="type"></aem-embed>',
  styles: [':host { display: block; }']
})
export class AemEmbedComponent {
  /** AEM page URL to embed (e.g. https://main--site--org.aem.page/) */
  @Input() url = '';

  /** Embed type: 'header' | 'footer' | 'main' (default) */
  @Input() type: 'header' | 'footer' | 'main' = 'main';
}
