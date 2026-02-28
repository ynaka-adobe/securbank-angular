import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface ServiceTokenCache {
  token: string | null;
  expiresAt: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private serviceTokenCache: ServiceTokenCache = {
    token: null,
    expiresAt: null
  };

  getAuthConfig(): string | [string, string] | null {
    const method = environment.authMethod;
    if (!method || method === 'none') {
      return null;
    }
    if (method === 'basic') {
      const user = environment.basicAuthUser;
      const pass = environment.basicAuthPass;
      return user && pass ? [user, pass] : null;
    }
    if (method === 'service-token') {
      return this.getServiceToken();
    }
    return null;
  }

  getServiceToken(): string | null {
    if (this.serviceTokenCache.token && this.serviceTokenCache.expiresAt && Date.now() < this.serviceTokenCache.expiresAt) {
      return this.serviceTokenCache.token;
    }
    return null;
  }

  setServiceToken(token: string, expiresIn = 3600): void {
    this.serviceTokenCache.token = token;
    this.serviceTokenCache.expiresAt = Date.now() + (expiresIn * 1000);
  }

  clearServiceToken(): void {
    this.serviceTokenCache.token = null;
    this.serviceTokenCache.expiresAt = null;
  }

  isServiceTokenAuth(): boolean {
    return environment.authMethod === 'service-token';
  }

  async fetchServiceTokenFromAPI(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/service-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch service token: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.access_token) {
        this.setServiceToken(data.access_token, data.expires_in);
        return data.access_token;
      }
      throw new Error('No access token in response');
    } catch (error) {
      console.error('Error fetching service token from API:', error);
      return null;
    }
  }
}
