import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const AVANTOR_BASE = 'https://main--avantor--ynaka-adobe.aem.live';

@Component({
  selector: 'app-content-redirect',
  standalone: true,
  template: '<p>Redirecting to Avantor...</p>'
})
export class ContentRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url; // e.g. /content or /content/home
    window.location.replace(AVANTOR_BASE + url);
  }
}
