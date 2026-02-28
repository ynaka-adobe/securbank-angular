import { Injectable } from '@angular/core';
import AEMHeadless from '@adobe/aem-headless-client-js';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AemService {
  private client: AEMHeadless;

  constructor(private auth: AuthService) {
    const serviceURL = environment.useProxy ? '/' : environment.hostUri;
    this.client = new AEMHeadless({
      serviceURL,
      endpoint: 'graphql/execute.json',
      auth: this.auth.getAuthConfig()
    });
  }

  /**
   * Runs persisted query. Path format: {graphqlEndpoint}/{queryName}
   * e.g. securbank/page-by-slug -> /graphql/execute.json/securbank/page-by-slug;slug=home;variation=master
   */
  runPersistedQuery(queryName: string, variables?: Record<string, unknown>): Promise<{ data?: unknown }> {
    const path = `${environment.graphqlEndpoint}/${queryName}`;
    return this.client.runPersistedQuery(path, variables ?? {});
  }

  addAemHost(url: string): string {
    if (url.startsWith('/')) {
      return new URL(url, environment.hostUri).toString();
    }
    return url;
  }
}
