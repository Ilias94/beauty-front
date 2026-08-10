import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop'
import { LoginAction, LoginFromLocalStorageAction, LogoutAction } from '../../state/security.actions';
import { NotificationBellComponent } from '../../common/notification-bell/notification-bell.component';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.sass',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatDividerModule,
        AsyncPipe,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        NotificationBellComponent,
        TranslocoModule,
    ]
})
export class MenuComponent implements OnInit{
  private breakpointObserver = inject(BreakpointObserver);
  private transloco = inject(TranslocoService);
  private platformId = inject(PLATFORM_ID);

  @Select(state => state.security.token)
  private token$ !: Observable<string>

  public token = toSignal(this.token$)

  public currentUser = toSignal(this.store.select(state => state.security.currentUser))

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  activeLang = this.transloco.getActiveLang();

  constructor(private store: Store){
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('lang');
      if (saved && ['en', 'pl'].includes(saved)) {
        this.transloco.setActiveLang(saved);
        this.activeLang = saved;
      }
    }
  }

  ngOnInit(): void {}

  setLang(lang: string): void {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }

  logout() {
    this.store.dispatch(new LogoutAction())
  }
}
