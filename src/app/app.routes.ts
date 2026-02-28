import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ServicesComponent } from './pages/services/services.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ContentRedirectComponent } from './pages/content-redirect/content-redirect.component';

export const routes: Routes = [
  { path: 'content', pathMatch: 'prefix', component: ContentRedirectComponent },
  { path: '', component: HomeComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/:slug', component: ArticleDetailComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/:slug', component: ServicesComponent },
  { path: '**', component: NotFoundComponent }
];
