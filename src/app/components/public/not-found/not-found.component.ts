import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [MatIconModule, MatButtonModule, TranslocoModule, RouterModule],
    template: `
    <div class="nf-wrap">
      <span class="nf-code">404</span>
      <p class="nf-msg">{{ 'notFound.message' | transloco }}</p>
      <button mat-flat-button color="primary" routerLink="/courses">
        <mat-icon>home</mat-icon>
        {{ 'notFound.home' | transloco }}
      </button>
    </div>
  `,
    styles: [`
    .nf-wrap
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      min-height: 60vh
      gap: 16px
      text-align: center
    .nf-code
      font-size: 6rem
      font-weight: 700
      color: #C2185B
      line-height: 1
    .nf-msg
      font-size: 1.2rem
      color: rgba(0,0,0,0.55)
      margin: 0
  `]
})
export class NotFoundComponent {}
