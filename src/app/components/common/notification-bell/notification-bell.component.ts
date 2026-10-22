import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { NotificationState, AppNotification } from '../../state/notification.state';
import { ClearNotificationsAction, MarkAllAsReadAction } from '../../state/notification.actions';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-notification-bell',
    templateUrl: './notification-bell.component.html',
    styleUrl: './notification-bell.component.sass',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        MatMenuModule,
        MatTooltipModule,
        DatePipe,
        TranslocoModule,
    ]
})
export class NotificationBellComponent {
  @Select(NotificationState.notifications)
  notifications$!: Observable<AppNotification[]>;

  @Select(NotificationState.unreadCount)
  unreadCount$!: Observable<number>;

  notifications = toSignal(this.notifications$, { initialValue: [] as AppNotification[] });
  unreadCount = toSignal(this.unreadCount$, { initialValue: 0 });

  constructor(private store: Store) {}

  onMenuOpen() {
    this.store.dispatch(new MarkAllAsReadAction());
  }

  clear() {
    this.store.dispatch(new ClearNotificationsAction());
  }
}
