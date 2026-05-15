import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ueCfResourceUrn } from '../../../utils/ue-cf-resource-urn';

@Component({
  selector: 'app-content-fragment',
  standalone: true,
  imports: [CommonModule],
  template: '<div [class]="className" [attr.data-aue-resource]="resourceAttr" [attr.data-aue-type]="fragmentType" [attr.data-aue-label]="compositeLabel" [attr.data-aue-behavior]="behavior"><ng-content></ng-content></div>'
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
    const urn = ueCfResourceUrn(cf._path, cf._variation);
    return urn || null;
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

  /** Matches SecurBank UE component ids: <code>article</code> | <code>service</code> (see public/static/component-definition.json). */
  get fragmentType(): string {
    const cf = this.cf as { _path?: string; _model?: { _path?: string } } | null;
    const modelPath = cf?._model?._path || '';
    if (modelPath.includes('article')) {
      return 'article';
    }
    if (modelPath.includes('service')) {
      return 'service';
    }
    const damPath = cf?._path || '';
    if (damPath.includes('/articles') || damPath.includes('/pages/articles')) {
      return 'article';
    }
    if (damPath.includes('/services')) {
      return 'service';
    }
    return 'service';
  }
}
