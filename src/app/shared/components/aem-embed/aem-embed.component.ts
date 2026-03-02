import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';

/**
 * Wrapper for the AEM Embed web component.
 * Creates the element programmatically so the url attribute is set before
 * connectedCallback runs (avoids "aem-embed missing url attribute" error).
 * @see https://www.aem.live/docs/aem-embed
 */
@Component({
  selector: 'app-aem-embed',
  standalone: true,
  template: '<div #host class="aem-embed-host"></div>',
  styles: [
    ':host { display: block; width: 100%; overflow: visible; }',
    ':host .aem-embed-host { display: block; width: 100%; overflow: visible; }'
  ]
})
export class AemEmbedComponent implements AfterViewInit, OnChanges {
  @ViewChild('host', { read: ElementRef }) host!: ElementRef<HTMLElement>;

  /** AEM page URL to embed (e.g. https://main--site--org.aem.page/) */
  @Input() url = '';

  /** Embed type: 'header' | 'footer' | 'main' (default) */
  @Input() type: 'header' | 'footer' | 'main' = 'main';

  private embedEl: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.createEmbed();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.host?.nativeElement && (changes['url'] || changes['type'])) {
      this.recreateEmbed();
    }
  }

  private recreateEmbed(): void {
    if (!this.embedEl || !this.host?.nativeElement) return;
    this.embedEl.remove();
    this.embedEl = null;
    this.createEmbed();
  }

  private createEmbed(): void {
    if (!this.url || !this.host?.nativeElement) return;
    const el = document.createElement('aem-embed');
    el.setAttribute('url', this.url);
    if (this.type && this.type !== 'main') {
      el.setAttribute('type', this.type);
    }
    this.host.nativeElement.appendChild(el);
    this.embedEl = el;
  }
}
