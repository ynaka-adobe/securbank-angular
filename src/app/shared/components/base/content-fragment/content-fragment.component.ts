import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-fragment',
  standalone: true,
  imports: [CommonModule],
  template: '<div [class]="className" [attr.data-aue-resource]="resourceAttr" data-aue-type="reference" [attr.data-aue-label]="compositeLabel" [attr.data-aue-behavior]="behavior"><ng-content></ng-content></div>'
})
export class ContentFragmentComponent {
  @Input() tag = 'div';
  @Input() cf: Record<string, unknown> | null = null;
  @Input() label = '';
  @Input() behavior = '';
  @Input() className = '';

  get resourceAttr(): string | null {
    const cf = this.cf as { _path?: string; _variation?: string };
    if (!cf?._path) return null;
    return `urn:aemconnection:${cf._path}/jcr:content/data/${cf._variation || 'master'}`;
  }

  get compositeLabel(): string {
    const cf = this.cf as { _metadata?: { stringMetadata?: { name?: string; value?: string }[] }; _model?: { title?: string } };
    let title = '';
    if (cf?._metadata?.stringMetadata) {
      const meta = cf._metadata.stringMetadata.find(m => m?.name === 'title');
      title = meta?.value || '';
    }
    const modelTitle = (cf?._model as { title?: string })?.title || '';
    return this.label || modelTitle + (title ? ` (${title})` : '');
  }
}
