import { Component, inject, PLATFORM_ID, signal, computed, HostListener, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngxs/store';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { LogoutAction } from '../../state/security.actions';
import { NotificationBellComponent } from '../../common/notification-bell/notification-bell.component';
import { S3_BASE } from '../../../app.const';

/** App shell: sticky top bar, account menu, mobile drawer and footer around the routed page. */
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.sass',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatTooltipModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        NotificationBellComponent,
        TranslocoModule,
    ]
})
export class MenuComponent {
  private store = inject(Store);
  private transloco = inject(TranslocoService);
  private platformId = inject(PLATFORM_ID);

  token = toSignal(this.store.select(state => state.security.token));
  currentUser = toSignal(this.store.select(state => state.security.currentUser));

  isTeacher = computed(() => !!this.currentUser()?.teacher);
  isSupport = computed(() => !!this.currentUser()?.roles?.includes('SUPPORT'));
  initials = computed(() => {
    const user = this.currentUser();
    return ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() || '·';
  });
  avatarUrl = computed(() => {
    const fileName = this.currentUser()?.fileName;
    return fileName ? S3_BASE + fileName : null;
  });

  drawerOpen = signal(false);
  scrolled = signal(false);
  activeLang = signal(this.transloco.getActiveLang());
  readonly year = new Date().getFullYear();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('lang');
      if (saved && ['en', 'pl'].includes(saved)) {
        this.setLang(saved);
      }
    }
    inject(Router).events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.drawerOpen.set(false));
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 4);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.drawerOpen.set(false);
  }

  toggleDrawer() {
    this.drawerOpen.update(open => !open);
  }

  setLang(lang: string): void {
    this.transloco.setActiveLang(lang);
    this.activeLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
    }
  }

  logout() {
    this.drawerOpen.set(false);
    this.store.dispatch(new LogoutAction());
  }
}
