export class AddNotificationAction {
  static readonly type = '[Notification] Add';
  constructor(public title: string | undefined, public message: string) {}
}

export class MarkAllAsReadAction {
  static readonly type = '[Notification] Mark All As Read';
}

export class ClearNotificationsAction {
  static readonly type = '[Notification] Clear All';
}
