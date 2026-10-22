import { Component, inject, PLATFORM_ID, signal, computed, HostListener, DestroyRef, ElementRef, ViewChild, afterNextRender, ChangeDetectionStrategy } from '@angular/core';
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
import { ProgressBarComponent } from '../../../core/loading/progress-bar.component';

/** App shell: sticky top bar, account menu, mobile drawer and footer around the routed page. */
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.sass',
    changeDetection: ChangeDetectionStrategy.Eager,
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
        ProgressBarComponent,
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
  ownedCount = computed<number>(() => this.currentUser()?.ownedCourseIds?.length ?? 0);
  enrolledCount = computed<number>(() => this.currentUser()?.enrolledCourseIds?.length ?? 0);
  initials = computed(() => {
    const user = this.currentUser();
    return ((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')).toUpperCase() || '·';
  });
  avatarUrl = computed(() => {
    const fileName = this.currentUser()?.fileName;
    return fileName ? S3_BASE + fileName : null;
  });

  @ViewChild('mainNav') private mainNav?: ElementRef<HTMLElement>;
  /** Where the sliding pill sits: under the active nav link, or hidden (width 0) when no link is active. */
  indicator = signal({ left: 0, width: 0 });

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
    const destroyRef = inject(DestroyRef);
    inject(Router).events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed(destroyRef))
      .subscribe(() => this.drawerOpen.set(false));

    // Follow routerLinkActive itself (it can apply the class after a view transition) and the nav's size
    // (links appear after login and change width with the language).
    afterNextRender(() => {
      const nav = this.mainNav?.nativeElement;
      if (!nav || typeof ResizeObserver === 'undefined') return;
      const resize = new ResizeObserver(() => this.moveIndicator());
      const classes = new MutationObserver(() => this.moveIndicator());
      resize.observe(nav);
      classes.observe(nav, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
      destroyRef.onDestroy(() => { resize.disconnect(); classes.disconnect(); });
      this.moveIndicator();
    });
  }

  private moveIndicator() {
    const active = this.mainNav?.nativeElement.querySelector<HTMLElement>('a.active');
    const next = active && active.offsetWidth ? { left: active.offsetLeft, width: active.offsetWidth } : { left: 0, width: 0 };
    const current = this.indicator();
    if (next.left !== current.left || next.width !== current.width) this.indicator.set(next);
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
