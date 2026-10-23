import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddNotificationAction, ClearNotificationsAction, MarkAllAsReadAction } from './notification.actions';

export interface AppNotification {
  title?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export class NotificationStateModel {
  notifications: AppNotification[];
}

const defaults: NotificationStateModel = {
  notifications: []
};

@State<NotificationStateModel>({
  name: 'notification',
  defaults
})
@Injectable()
export class NotificationState {

  @Action(AddNotificationAction)
  add({ getState, patchState }: StateContext<NotificationStateModel>, { title, message }: AddNotificationAction) {
    patchState({
      notifications: [
        { title, message, timestamp: new Date().toISOString(), read: false },
        ...getState().notifications
      ]
    });
  }

  @Action(MarkAllAsReadAction)
  markAllAsRead({ getState, patchState }: StateContext<NotificationStateModel>) {
    patchState({
      notifications: getState().notifications.map(n => ({ ...n, read: true }))
    });
  }

  @Action(ClearNotificationsAction)
  clearAll({ patchState }: StateContext<NotificationStateModel>) {
    patchState({ notifications: [] });
  }

  @Selector()
  static notifications(state: NotificationStateModel) {
    return state.notifications;
  }

  @Selector()
  static unreadCount(state: NotificationStateModel) {
    return state.notifications.filter(n => !n.read).length;
  }
}
