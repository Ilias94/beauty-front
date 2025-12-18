import { Component, OnInit, Signal, computed, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { FilterCoursesByDateAction } from '../state/course.actions';
import moment from 'moment';
import { toSignal } from '@angular/core/rxjs-interop';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { title } from 'process';
import { start } from 'repl';
import { CourseDtoResponse } from '../../../api/models';
import { SecurityState } from '../state/security.state';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.sass'
})
export class CalendarComponent implements OnInit {
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  constructor(private store: Store) { }

  // ŚWIETNIE – sygnał NGXS -> Angular Signal
  coursesByDate: Signal<CourseDtoResponse[]> = toSignal(
    this.store.select(state => state.course.coursesByDate)
  );

  // Eventy mapowane dynamicznie (bardzo dobrze)
  calendarEvents = computed<EventInput[]>(() =>
    this.coursesByDate().map(course => ({
      title: course.title,
      start: course.startDate,
      end: course.endDate
    }))
  );

  // Konfiguracja FullCalendar
  calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: this.calendarEvents(),

    // 🔥 KLUCZOWE: pobranie danych po zmianie miesiąca
    datesSet: (info) => {
      const start = moment(info.start).format('YYYY-MM-DD');
      const end = moment(info.end).format('YYYY-MM-DD');
      this.store.dispatch(new FilterCoursesByDateAction(start, end));
    },

    eventClick: (info) => {
      alert(`Kliknąłeś kurs: ${info.event.title}`);
    }
  }));

  ngOnInit(): void {
    // 🔥 Pierwsze pobranie danych (dla aktualnego miesiąca)
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    this.store.dispatch(new FilterCoursesByDateAction(startOfMonth, endOfMonth));
  }

  isTeacher(): boolean {
    return !!this.currentUser()?.teacher;
  }
}
