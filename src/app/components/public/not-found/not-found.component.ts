import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [MatIconModule, MatButtonModule, TranslocoModule, RouterModule],
    template: `
    <div class="empty-state nf">
      <span class="nf-code">404</span>
      <h1>{{ 'notFound.title' | transloco }}</h1>
      <p>{{ 'notFound.message' | transloco }}</p>
      <a mat-flat-button color="primary" routerLink="/courses">{{ 'notFound.home' | transloco }}</a>
    </div>
  `,
    styles: [`
    .nf
      min-height: 60vh
      justify-content: center

    .nf-code
      font: italic 500 clamp(96px, 16vw, 168px)/1 var(--font-display)
      color: var(--accent)

    h1
      font-size: clamp(28px, 4vw, 38px)
  `]
})
export class NotFoundComponent {}
