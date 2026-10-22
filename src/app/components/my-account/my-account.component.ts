import { Component, computed, inject, Signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserDtoResponse } from '../../../api/models';
import { TranslocoModule } from '@jsverse/transloco';
import { S3_BASE } from '../../app.const';
import { SpotlightDirective } from '../../shared/spotlight.directive';

interface Shortcut {
  icon: string;
  titleKey: string;
  descKey: string;
  route: string;
  teacherOnly?: boolean;
}

/** Profile dashboard: who you are and shortcuts to everything account-related. */
@Component({
    selector: 'app-my-account',
    imports: [SpotlightDirective, MatButtonModule, MatIconModule, RouterModule, TranslocoModule],
    templateUrl: './my-account.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './my-account.component.sass'
})
export class MyAccountComponent {
  private store = inject(Store);

  currentUser: Signal<UserDtoResponse | undefined> = toSignal(this.store.select(state => state.security.currentUser));

  avatarUrl = computed(() => {
    const fileName = this.currentUser()?.fileName;
    return fileName ? S3_BASE + fileName : null;
  });

  initials = computed(() => {
    const u = this.currentUser();
    return ((u?.firstName?.[0] ?? '') + (u?.lastName?.[0] ?? '')).toUpperCase() || '·';
  });

  enrolledCount = computed(() => this.currentUser()?.enrolledCourseIds?.length ?? 0);
  ownedCount = computed(() => this.currentUser()?.ownedCourseIds?.length ?? 0);

  readonly shortcuts: Shortcut[] = [
    { icon: 'auto_stories', titleKey: 'menu.myCourses', descKey: 'account.myCoursesDesc', route: '/student-courses' },
    { icon: 'calendar_month', titleKey: 'menu.calendar', descKey: 'account.calendarDesc', route: '/calendar' },
    { icon: 'school', titleKey: 'menu.myTeaching', descKey: 'account.teachingDesc', route: '/creator-courses', teacherOnly: true },
    { icon: 'forum', titleKey: 'menu.groupChats', descKey: 'account.groupChatsDesc', route: '/group-chats' },
    { icon: 'rate_review', titleKey: 'account.myComments', descKey: 'account.myCommentsDesc', route: '/my-comments' },
    { icon: 'support_agent', titleKey: 'menu.myTickets', descKey: 'account.ticketsDesc', route: '/my-tickets' },
    { icon: 'tune', titleKey: 'account.accountSettings', descKey: 'account.accountSettingsDesc', route: '/account' },
  ];
}
