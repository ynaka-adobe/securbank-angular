import { Component, OnInit } from '@angular/core';
import { ArticlesSectionComponent } from '../../features/articles/components/articles-section/articles-section.component';
import { CallToActionSectionComponent } from '../../features/home/components/call-to-action-section/call-to-action-section.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [ArticlesSectionComponent, CallToActionSectionComponent],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: unknown[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.loadArticles().then(data => {
      this.articles = data ? (data as { node?: unknown }[]).map(n => n.node ?? n) : [];
    });
  }
}
