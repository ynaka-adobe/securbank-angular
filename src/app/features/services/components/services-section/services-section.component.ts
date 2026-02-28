import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { SelectorButtonComponent } from '../../../../shared/components/selector-button/selector-button.component';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [KeyValuePipe, ServiceCardComponent, SelectorButtonComponent],
  templateUrl: './services-section.component.html',
  styleUrls: ['./services-section.component.scss']
})
export class ServicesSectionComponent implements OnInit, OnChanges {
  @Input() slug = '';
  @Input() cfs: unknown[] = [];
  selectedCategory = 'All Services';
  categorisedServices: Record<string, unknown[]> = {};

  ngOnInit(): void {
    this.updateCategorisedServices();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateCategorisedServices();
  }

  private updateCategorisedServices(): void {
    const map: Record<string, unknown[]> = { 'All Services': [] };
    for (const service of this.cfs || []) {
      const s = service as Record<string, unknown>;
      const category = (s?.['serviceCategory'] as { name?: string })?.name;
      if (category) {
        map[category] = map[category] || [];
        if (s?.['slug'] !== this.slug) {
          (map[category] as unknown[]).push(service);
        } else {
          this.selectedCategory = category;
        }
      }
      if (s?.['slug'] !== this.slug) {
        (map['All Services'] as unknown[]).push(service);
      }
    }
    this.categorisedServices = map;
  }

  getServices(): unknown[] {
    return (this.categorisedServices[this.selectedCategory] as unknown[]) || [];
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
  }
}
