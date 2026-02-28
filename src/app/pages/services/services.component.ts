import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceDetailComponent } from '../../features/services/components/service-detail/service-detail.component';
import { ServicesSectionComponent } from '../../features/services/components/services-section/services-section.component';
import { CallToActionSectionComponent } from '../../features/home/components/call-to-action-section/call-to-action-section.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ServiceDetailComponent, ServicesSectionComponent, CallToActionSectionComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  slug: string | null = null;
  services: unknown[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.api.loadServices().then(data => {
      const edges = data as { node?: unknown }[] | null;
      this.services = edges ? edges.map(n => n.node ?? n) : [];
    });
  }
}
