import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type StatusKind = 'ok' | 'warn' | 'err' | 'info';

@Component({
  selector: 'app-cookie-test',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cookie-test.component.html',
  styleUrls: ['./cookie-test.component.scss']
})
export class CookieTestComponent implements OnInit {
  cookieName = 'sb_cookie_partition_test';
  cookieValue = `v-${Date.now()}`;

  rawDocumentCookie = '';
  parsedCookies: { name: string; value: string }[] = [];

  isSecureContext = false;
  cookieEnabled = false;

  statusMessage = '';
  statusKind: StatusKind = 'info';

  ngOnInit(): void {
    this.isSecureContext =
      typeof window !== 'undefined' && typeof window.isSecureContext === 'boolean' ? window.isSecureContext : false;
    this.cookieEnabled = typeof navigator !== 'undefined' ? navigator.cookieEnabled : false;
    this.refreshReadout();
    if (!this.isSecureContext) {
      this.setStatus(
        'warn',
        'Not a secure context: SameSite=None and Secure cookies may be rejected. Use HTTPS or http://localhost.'
      );
    } else if (!this.cookieEnabled) {
      this.setStatus('err', 'Cookies appear disabled in this browser.');
    } else {
      this.setStatus('info', 'Use Set (partitioned) or Set (SameSite=None only), then confirm values below.');
    }
  }

  setPartitioned(): void {
    if (!this.canWriteCookies()) {
      return;
    }
    const line = this.buildCookieLine(true);
    document.cookie = line;
    this.refreshReadout();
    this.setStatus('ok', `Set-Cookie line used (partitioned): ${line}`);
  }

  setSameSiteNoneOnly(): void {
    if (!this.canWriteCookies()) {
      return;
    }
    const line = this.buildCookieLine(false);
    document.cookie = line;
    this.refreshReadout();
    this.setStatus('ok', `Set-Cookie line used (no Partitioned): ${line}`);
  }

  clearTestCookie(): void {
    if (!this.canWriteCookies()) {
      return;
    }
    const name = this.safeCookieName(this.cookieName);
    const base = `Path=/; Secure; SameSite=None`;
    document.cookie = `${name}=; ${base}; Max-Age=0`;
    document.cookie = `${name}=; ${base}; Partitioned; Max-Age=0`;
    this.refreshReadout();
    this.setStatus('info', `Cleared "${name}" with both Partitioned and non-partitioned delete attempts.`);
  }

  refreshReadout(): void {
    this.rawDocumentCookie = typeof document !== 'undefined' ? document.cookie : '';
    this.parsedCookies = this.parseDocumentCookie(this.rawDocumentCookie);
  }

  private canWriteCookies(): boolean {
    if (!this.isSecureContext) {
      this.setStatus('err', 'Cannot rely on SameSite=None / Secure cookies outside a secure context.');
      return false;
    }
    if (!this.cookieEnabled) {
      this.setStatus('err', 'Cookies are disabled; cannot run the test.');
      return false;
    }
    const name = this.safeCookieName(this.cookieName);
    if (!name.length) {
      this.setStatus('err', 'Enter a non-empty cookie name using letters, numbers, and simple symbols.');
      return false;
    }
    return true;
  }

  private buildCookieLine(partitioned: boolean): string {
    const name = this.safeCookieName(this.cookieName);
    const value = encodeURIComponent(this.cookieValue ?? '');
    const flags = partitioned
      ? `Path=/; Secure; SameSite=None; Partitioned`
      : `Path=/; Secure; SameSite=None`;
    return `${name}=${value}; ${flags}`;
  }

  /** Cookie names are restrictive; keep the lab predictable. */
  private safeCookieName(raw: string): string {
    return (raw ?? '').trim().replace(/[^\w!#%&'*+\-.^`|~]/g, '');
  }

  private parseDocumentCookie(header: string): { name: string; value: string }[] {
    if (!header.trim()) {
      return [];
    }
    return header.split(';').map((part) => {
      const idx = part.indexOf('=');
      if (idx === -1) {
        return { name: part.trim(), value: '' };
      }
      return {
        name: part.slice(0, idx).trim(),
        value: part.slice(idx + 1).trim()
      };
    });
  }

  private setStatus(kind: StatusKind, message: string): void {
    this.statusKind = kind;
    this.statusMessage = message;
  }
}
