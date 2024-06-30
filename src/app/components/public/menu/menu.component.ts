import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop'
import { LoginAction, LoginFromLocalStorageAction, LogoutAction } from '../../state/security.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink
  ]
})
export class MenuComponent implements OnInit{
  private breakpointObserver = inject(BreakpointObserver);
  @Select(state => state.security.token)
  private token$ !: Observable<string>

  public token = toSignal(this.token$)

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    constructor(private store: Store){}
  ngOnInit(): void {
    this.store.dispatch(new LoginFromLocalStorageAction())
  }
    logout() {
      this.store.dispatch(new LogoutAction())
    } 
}
