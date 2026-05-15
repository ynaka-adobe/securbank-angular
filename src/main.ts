import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { loadAemEmbedWebComponent } from './load-aem-embed';

loadAemEmbedWebComponent()
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch((err) => console.error(err));
