import { Component } from '@angular/core';
import { RedirectButtonComponent } from '../../../../shared/components/redirect-button/redirect-button.component';

@Component({
  selector: 'app-call-to-action-section',
  standalone: true,
  imports: [RedirectButtonComponent],
  templateUrl: './call-to-action-section.component.html',
  styleUrls: ['./call-to-action-section.component.scss']
})
export class CallToActionSectionComponent {}
