import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

/** Brand panel next to the login and register forms (hidden on small screens). */
@Component({
  selector: 'app-auth-aside',
  imports: [MatIconModule, TranslocoModule],
  template: `
    <aside class="aside">
      <div class="aside-inner">
        <span class="wordmark">Bellademy</span>
        <p class="statement">{{ 'auth.asideStatement' | transloco }}</p>
        <ul class="points">
          <li><mat-icon>workspace_premium</mat-icon>{{ 'auth.asidePoint1' | transloco }}</li>
          <li><mat-icon>groups</mat-icon>{{ 'auth.asidePoint2' | transloco }}</li>
          <li><mat-icon>play_circle</mat-icon>{{ 'auth.asidePoint3' | transloco }}</li>
        </ul>
      </div>
    </aside>
  `,
  styleUrl: './auth-aside.component.sass'
})
export class AuthAsideComponent {}
