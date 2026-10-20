import { Component, PLATFORM_ID, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { forkJoin } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import moment from 'moment';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import plLocale from '@fullcalendar/core/locales/pl';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule, MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseDtoResponse } from '../../../api/models';
import { CourseControllerService } from '../../../api/services';
import { DownloadFileCsvAction } from '../state/file.actions';
import { SecurityState } from '../state/security.state';
import { CourseOnlineComponent } from '../course-online/course-online.component';
import { DateRangePipe } from '../../shared/format.pipes';
import { categoryKey } from '../../shared/category-visual';
import { downloadIcs } from '../../shared/ics';
import { provideDayFirstDateAdapter } from '../../shared/day-first-date-adapter';

export type Relation = 'owner' | 'enrolled' | 'catalog';
export type CalendarView = 'plan' | 'month' | 'week';
type Status = 'upcoming' | 'ongoing' | 'past';

interface PlanDay { key: string; label: string; courses: CourseDtoResponse[] }

// Relation decides the colour: soft tint, strong text and left edge (FullCalendar needs literal colours,
// same values as the tokens in styles.sass). Status is shown separately: past fades, ongoing gets a live dot.
const COLORS: Record<Relation, { bg: string; text: string }> = {
  owner:    { bg: '#F6E8EC', text: '#8C2F4B' },
  enrolled: { bg: '#E6EDF5', text: '#3D5A80' },
  catalog:  { bg: '#F4EEE7', text: '#5E554E' },
};

/**
 * The user's schedule: their own and booked courses first ("My plan"), month and week grids,
 * filters with counts, a mini calendar and a details panel. Catalog courses are opt-in.
 */
@Component({
    selector: 'app-calendar',
    imports: [FullCalendarModule, TranslocoModule, RouterLink, MatButtonModule, MatIconModule, MatDatepickerModule,
        MatProgressSpinnerModule, NgTemplateOutlet, DateRangePipe],
    providers: [provideDayFirstDateAdapter()],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.sass',
    host: { '(document:keydown.escape)': 'selected.set(null)' }
})
export class CalendarComponent {
  @ViewChild(FullCalendarComponent) private fullCalendar?: FullCalendarComponent;
  @ViewChild(MatCalendar) private miniCalendar?: MatCalendar<Date>;

  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);
  private courseApi = inject(CourseControllerService);
  private dialog = inject(MatDialog);
  private browser = isPlatformBrowser(inject(PLATFORM_ID));

  private activeLang = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  /**
   * Upcoming catalog courses, loaded once and filtered by the visible range here: the dates-filter
   * endpoint only returns the user's own and booked courses, and the catalog is small.
   */
  private catalog = signal<CourseDtoResponse[]>([]);

  /** All of the user's own and booked courses, whatever the visible range. */
  owned = signal<CourseDtoResponse[]>([]);
  enrolled = signal<CourseDtoResponse[]>([]);
  mineLoading = signal(true);

  view = signal<CalendarView>('plan');
  filters = signal<Record<Relation, boolean>>({ owner: true, enrolled: true, catalog: false });
  selected = signal<CourseDtoResponse | null>(null);
  showPast = signal(false);
  /** Visible range of the month/week grid and its title ("październik 2026"). */
  range = signal<{ start: Date; end: Date } | null>(null);
  rangeTitle = signal('');
  /** The day the grid opens on and the mini calendar highlights. */
  focusDate = signal<Date>(new Date());

  readonly views: { key: CalendarView; icon: string }[] = [
    { key: 'plan', icon: 'view_agenda' },
    { key: 'month', icon: 'calendar_view_month' },
    { key: 'week', icon: 'view_week' },
  ];
  readonly relations: Relation[] = ['owner', 'enrolled', 'catalog'];
  readonly categoryKey = categoryKey;

  private ownedIds = computed(() => new Set(this.owned().map(c => c.id)));
  private enrolledIds = computed(() => new Set(this.enrolled().map(c => c.id)));

  relationOf(course: CourseDtoResponse): Relation {
    if (this.ownedIds().has(course.id)) return 'owner';
    if (this.enrolledIds().has(course.id)) return 'enrolled';
    return 'catalog';
  }

  statusOf(course: CourseDtoResponse): Status {
    const now = Date.now();
    if (Date.parse(course.endDate ?? course.startDate!) < now) return 'past';
    if (Date.parse(course.startDate!) > now) return 'upcoming';
    return 'ongoing';
  }

  private bookedOnly = computed(() => this.enrolled().filter(c => !this.ownedIds().has(c.id)));

  /** Catalog courses that aren't the user's, within the visible grid range (all upcoming on the plan). */
  private catalogInRange = computed(() => {
    const mine = new Set([...this.ownedIds(), ...this.enrolledIds()]);
    const range = this.view() === 'plan' ? null : this.range();
    return this.catalog().filter(c => !mine.has(c.id) && (!range || this.overlaps(c, range)));
  });

  counts = computed<Record<Relation, number>>(() => ({
    owner: this.owned().length,
    enrolled: this.bookedOnly().length,
    catalog: this.catalogInRange().length,
  }));

  /** Courses that pass the filters: own and booked ones in full, catalog ones for the visible range. */
  visibleCourses = computed(() => {
    const f = this.filters();
    return [
      ...(f.owner ? this.owned() : []),
      ...(f.enrolled ? this.bookedOnly() : []),
      ...(f.catalog ? this.catalogInRange() : []),
    ];
  });

  private events = computed<EventInput[]>(() => {
    const week = this.view() === 'week';
    return this.visibleCourses().flatMap(course => {
      const color = COLORS[this.relationOf(course)];
      const base = {
        id: String(course.id),
        title: course.title,
        backgroundColor: color.bg,
        borderColor: color.text,
        textColor: color.text,
        classNames: [`is-${this.statusOf(course)}`],
      };
      // The month shows a multi-day course as one bar; the week, as its daily sessions.
      return (week ? this.sessions(course) : [{ start: course.startDate!, end: course.endDate ?? course.startDate! }])
        .map(session => ({ ...base, ...session }));
    });
  });

  // ── "My plan": own and booked courses grouped by day ────────────────────
  private mineFiltered = computed(() => this.visibleCourses()
    .filter(c => this.relationOf(c) !== 'catalog')
    .sort((a, b) => a.startDate!.localeCompare(b.startDate!)));

  upcomingDays = computed(() => this.groupByDay(this.mineFiltered().filter(c => this.statusOf(c) !== 'past')));
  pastCourses = computed(() => this.mineFiltered().filter(c => this.statusOf(c) === 'past').reverse());

  /** The next own or booked course after the visible range, for the "nothing here" hint. */
  nextAfterRange = computed(() => {
    const range = this.range();
    if (!range) return null;
    const after = range.end.getTime();
    return [...this.owned(), ...this.bookedOnly()]
      .filter(c => Date.parse(c.startDate!) >= after)
      .sort((a, b) => a.startDate!.localeCompare(b.startDate!))[0] ?? null;
  });

  rangeIsEmpty = computed(() => {
    const range = this.range();
    if (!range || this.mineLoading()) return false;
    return !this.visibleCourses().some(c => this.overlaps(c, range));
  });

  /** Mini calendar: a dot on every day one of the visible courses takes place. */
  private busyDays = computed(() => {
    const days = new Set<string>();
    for (const c of this.visibleCourses()) {
      const end = moment(c.endDate ?? c.startDate);
      for (const d = moment(c.startDate); d.isSameOrBefore(end, 'day'); d.add(1, 'day')) days.add(d.format('YYYY-MM-DD'));
    }
    return days;
  });

  dateClass = computed<MatCalendarCellClassFunction<Date>>(() => {
    const days = this.busyDays();
    return (date, view) => view === 'month' && days.has(moment(date).format('YYYY-MM-DD')) ? 'has-course' : '';
  });

  calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: this.view() === 'week' ? 'timeGridWeek' : 'dayGridMonth',
    initialDate: this.focusDate(),
    locale: this.activeLang() === 'pl' ? plLocale : 'en',
    firstDay: 1,
    height: 'auto',
    dayMaxEvents: 3,
    nowIndicator: true,
    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    headerToolbar: false,
    events: this.events(),
    datesSet: info => {
      this.range.set({ start: info.start, end: info.end });
      this.rangeTitle.set(info.view.title);
      // Keep the mini calendar on the month the grid shows.
      if (this.miniCalendar) {
        const middle = (info.view.currentStart.getTime() + info.view.currentEnd.getTime()) / 2;
        this.miniCalendar.activeDate = new Date(middle);
      }
    },
    eventClick: info => {
      info.jsEvent.preventDefault();
      this.selected.set(this.visibleCourses().find(c => String(c.id) === info.event.id) ?? null);
    },
  }));

  constructor() {
    const fromUrl = this.route.snapshot.queryParamMap.get('view') as CalendarView | null;
    if (fromUrl && ['plan', 'month', 'week'].includes(fromUrl)) this.view.set(fromUrl);

    const dateAdapter = inject(DateAdapter);
    this.transloco.langChanges$.pipe(takeUntilDestroyed()).subscribe(lang => dateAdapter.setLocale(lang === 'en' ? 'en-GB' : 'pl-PL'));

    forkJoin({
      owned: this.courseApi.getCourses({ isCurrentCreator: true, page: 0, size: 100 }),
      enrolled: this.courseApi.getCourses({ isCurrentStudent: true, page: 0, size: 100 }),
      catalog: this.courseApi.getCourses({ hidePast: true, page: 0, size: 200 }),
    }).pipe(takeUntilDestroyed()).subscribe({
      next: ({ owned, enrolled, catalog }) => {
        this.owned.set(owned.content ?? []);
        this.enrolled.set(enrolled.content ?? []);
        this.catalog.set(catalog.content ?? []);
        this.mineLoading.set(false);
      },
      error: () => this.mineLoading.set(false),
    });

    // MatCalendar only re-evaluates dateClass when asked to.
    effect(() => {
      this.dateClass();
      queueMicrotask(() => this.miniCalendar?.updateTodaysDate());
    });
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  setView(view: CalendarView): void {
    if (view === this.view()) return;
    const api = this.fullCalendar?.getApi();
    if (api) this.focusDate.set(api.getDate());
    this.view.set(view);
    this.router.navigate([], { queryParams: { view }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  toggle(relation: Relation): void {
    this.filters.update(f => ({ ...f, [relation]: !f[relation] }));
  }

  prev(): void { this.fullCalendar?.getApi().prev(); }
  next(): void { this.fullCalendar?.getApi().next(); }
  today(): void { this.goTo(new Date()); }

  /** Mini calendar and "next course" hint: show that day in the grid (the plan switches to the month). */
  goTo(date: Date): void {
    this.focusDate.set(date);
    if (this.view() === 'plan') {
      this.setView('month');
      return;
    }
    this.fullCalendar?.getApi().gotoDate(date);
  }

  goToCourse(course: CourseDtoResponse): void {
    this.goTo(new Date(course.startDate!));
  }

  // ── Details panel ───────────────────────────────────────────────────────

  where(course: CourseDtoResponse): string {
    if (course.courseType === 'ONLINE') return this.transloco.translate('courseDetails.onlineWhere');
    const a = course.address;
    const street = [a?.street, a?.streetNumber].filter(Boolean).join(' ');
    return [street, a?.city].filter(Boolean).join(', ');
  }

  hasVideos(course: CourseDtoResponse): boolean {
    return course.courseType !== 'IN_PERSON' && this.relationOf(course) !== 'catalog';
  }

  addToCalendar(course: CourseDtoResponse): void {
    if (this.browser) downloadIcs(course, `${location.origin}/course/${course.id}`, this.where(course));
  }

  openVideos(course: CourseDtoResponse): void {
    this.dialog.open(CourseOnlineComponent, {
      width: '900px',
      maxWidth: '96vw',
      data: { courseId: course.id, courseTitle: course.title, canEdit: this.relationOf(course) === 'owner' },
    });
  }

  downloadParticipants(course: CourseDtoResponse): void {
    this.store.dispatch(new DownloadFileCsvAction(course.id!));
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  /** "28–29 Oct, 10:00–17:00" -> one session per day; a course ending at an earlier hour stays one block. */
  private sessions(course: CourseDtoResponse): { start: string; end: string }[] {
    const start = course.startDate!, end = course.endDate ?? start;
    const startTime = start.slice(11, 19), endTime = end.slice(11, 19);
    if (start.slice(0, 10) === end.slice(0, 10) || endTime <= startTime) return [{ start, end }];
    const out: { start: string; end: string }[] = [];
    for (const d = moment(start.slice(0, 10)); d.isSameOrBefore(end.slice(0, 10), 'day'); d.add(1, 'day')) {
      const day = d.format('YYYY-MM-DD');
      out.push({ start: `${day}T${startTime}`, end: `${day}T${endTime}` });
    }
    return out;
  }

  private overlaps(course: CourseDtoResponse, range: { start: Date; end: Date }): boolean {
    return Date.parse(course.startDate!) < range.end.getTime()
      && Date.parse(course.endDate ?? course.startDate!) >= range.start.getTime();
  }

  timeRange(course: CourseDtoResponse): string {
    const start = course.startDate!.slice(11, 16);
    const end = (course.endDate ?? '').slice(11, 16);
    return end && end !== start ? `${start}–${end}` : start;
  }

  private groupByDay(courses: CourseDtoResponse[]): PlanDay[] {
    const locale = this.activeLang() === 'en' ? 'en-GB' : 'pl-PL';
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    const days = new Map<string, PlanDay>();
    for (const course of courses) {
      // An ongoing multi-day course is listed under today rather than its (past) first day.
      const key = this.statusOf(course) === 'ongoing' ? today : course.startDate!.slice(0, 10);
      if (!days.has(key)) {
        const label = key === today ? this.transloco.translate('calendar.plan.today')
          : key === tomorrow ? this.transloco.translate('calendar.plan.tomorrow')
          : new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(key + 'T12:00:00'));
        days.set(key, { key, label, courses: [] });
      }
      days.get(key)!.courses.push(course);
    }
    return [...days.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
}
