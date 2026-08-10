import { Component, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { FilterCoursesByDateAction } from '../state/course.actions';
import { SecurityState } from '../state/security.state';
import moment from 'moment';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import plLocale from '@fullcalendar/core/locales/pl';
import { CourseDtoResponse } from '../../../api/models';

const STATUS_COLORS: Record<string, { bg: string; border: string }> = {
  upcoming: { bg: '#C2185B', border: '#880E4F' },
  ongoing:  { bg: '#2e7d32', border: '#1b5e20' },
  past:     { bg: '#9e9e9e', border: '#757575' },
};

const OWNER_COLOR    = { bg: '#6A1B9A', border: '#4A148C' };
const ENROLLED_COLOR = { bg: '#0277BD', border: '#01579B' };

function getCourseStatus(startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date();
  if (new Date(endDate) < now) return 'past';
  if (new Date(startDate) > now) return 'upcoming';
  return 'ongoing';
}

@Component({
    selector: 'app-calendar',
    imports: [FullCalendarModule, TranslocoModule, MatProgressSpinnerModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.sass'
})
export class CalendarComponent {
  private store = inject(Store);
  private router = inject(Router);
  private transloco = inject(TranslocoService);

  private activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  private currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  coursesByDate: Signal<CourseDtoResponse[]> = toSignal(
    this.store.select(state => state.course.coursesByDate),
    { initialValue: [] }
  );

  isLoading = toSignal(
    this.store.select(state => state.course.loadingByDate),
    { initialValue: false }
  );

  calendarEvents = computed<EventInput[]>(() => {
    const user = this.currentUser();
    const ownedIds = user?.ownedCourseIds ?? [];
    const enrolledIds = user?.enrolledCourseIds ?? [];

    return this.coursesByDate().map(course => {
      const id = course.id!;
      let color: { bg: string; border: string };
      let relation: 'owner' | 'enrolled' | 'other';

      if (ownedIds.includes(id)) {
        color = OWNER_COLOR;
        relation = 'owner';
      } else if (enrolledIds.includes(id)) {
        color = ENROLLED_COLOR;
        relation = 'enrolled';
      } else {
        const status = getCourseStatus(course.startDate!, course.endDate!);
        color = STATUS_COLORS[status];
        relation = 'other';
      }

      return {
        id: String(id),
        title: course.title,
        start: course.startDate,
        end: course.endDate,
        backgroundColor: color.bg,
        borderColor: color.border,
        extendedProps: { relation },
      };
    });
  });

  calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: this.activeLang() === 'pl' ? plLocale : 'en',
    firstDay: 1,
    events: this.calendarEvents(),
    height: 'auto',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth',
    },

    noEventsText: this.transloco.translate('calendar.noEvents'),

    datesSet: (info) => {
      const start = moment(info.start).format('YYYY-MM-DD');
      const end = moment(info.end).format('YYYY-MM-DD');
      this.store.dispatch(new FilterCoursesByDateAction(start, end));
    },

    eventClick: (info) => {
      this.router.navigate(['/course', info.event.id]);
    },
  }));
}
