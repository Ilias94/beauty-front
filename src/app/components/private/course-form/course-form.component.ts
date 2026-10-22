import { Component, DestroyRef, ElementRef, PLATFORM_ID, computed, inject, signal, DOCUMENT, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { catchError, debounceTime, last, map, of, pairwise, startWith, switchMap } from 'rxjs';
import { Store } from '@ngxs/store';
import { DateAdapter, ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GetDistinctCitiesAction, SaveCourseAction } from '../../state/course.actions';
import { GetAiPromptAction } from '../../state/ai.actions';
import { SecurityState } from '../../state/security.state';
import { AddressDtoResponse, CourseDtoResponse } from '../../../../api/models';
import { CourseControllerService } from '../../../../api/services';
import { CourseCardComponent } from '../../courses/course-card/course-card.component';
import { categoryKey, categoryVisual } from '../../../shared/category-visual';
import { DateRangePipe, PricePipe } from '../../../shared/format.pipes';
import { PluralPipe } from '../../../shared/plural.pipe';
import { NotificationService } from '../../../core/notification/notification.service';
import { provideDayFirstDateAdapter } from '../../../shared/day-first-date-adapter';
import { SpotlightDirective } from '../../../shared/spotlight.directive';
import { GalleryEditorComponent } from '../../../shared/gallery-editor/gallery-editor.component';
import { CourseImagesApiService } from '../../../services/course-images-api.service';

type CourseType = 'IN_PERSON' | 'ONLINE' | 'HYBRID';
type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type StepKey = 'basics' | 'details' | 'photos' | 'schedule' | 'pricing' | 'review';

/** Backend category labels; shown translated with their catalog visual. */
const CATEGORIES = [
  'Makeup Artist', 'Permanent Makeup Artist', 'Nail Technician', 'Lash Technician', 'Hairdresser',
  'Hair Colorist', 'Barber', 'Esthetician', 'Skin Care Specialist', 'Massage Therapist', 'Wax Specialist',
];

const DRAFT_KEY = 'bellademy.courseDraft.v1';

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/** A Date carrying only a time of day, the value the Material timepicker works with. */
function atTime(hours: number, minutes = 0): Date {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/** A time from a saved draft: an ISO date, or "HH:mm" from drafts saved before the timepicker. */
function draftTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const hhmm = value.match(/^(\d{1,2}):(\d{2})$/);
  return hhmm ? atTime(+hhmm[1], +hhmm[2]) : new Date(value);
}

function isValidTime(time: Date | null): time is Date {
  return !!time && !isNaN(time.getTime());
}

function minutesOf(time: Date): number {
  return time.getHours() * 60 + time.getMinutes();
}

/** Identifies a place regardless of letter case, so the same salon is suggested once. */
function addressKey(a: AddressDtoResponse): string {
  return [a.street, a.streetNumber, a.apartmentNumber, a.city].map(part => (part ?? '').trim().toLocaleLowerCase()).join('|');
}

/** The distinct street addresses of the given courses, in their order, at most three. */
function recentAddressesOf(courses: CourseDtoResponse[]): AddressDtoResponse[] {
  const seen = new Set<string>();
  return courses
    .map(course => course.address)
    .filter((a): a is AddressDtoResponse => !!a?.street && !!a.city)
    .filter(a => !seen.has(addressKey(a)) && !!seen.add(addressKey(a)))
    .slice(0, 3);
}

/** "2027-06-10T09:00:00" in local time, the format the backend expects. */
function toLocalIso(date: Date, time?: Date | null): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(time?.getHours() ?? 0)}:${pad(time?.getMinutes() ?? 0)}:00`;
}

/**
 * Six-step course creation wizard with a live catalog-card preview, a local draft that survives
 * reloads, and an on-demand AI description (instead of generating on every title keystroke).
 */
@Component({
    selector: 'app-course-form',
    // Errors only after a field is touched: the form is "submitted" on every Next, which would flag later steps early.
    providers: [provideDayFirstDateAdapter(), { provide: ErrorStateMatcher, useValue: { isErrorState: (c: AbstractControl | null) => !!(c?.invalid && c.touched) } }],
    imports: [SpotlightDirective, 
        ReactiveFormsModule, RouterModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatDatepickerModule, MatTimepickerModule, MatAutocompleteModule, MatChipsModule, MatSlideToggleModule, MatProgressSpinnerModule,
        TranslocoModule, CourseCardComponent, DatePipe, DateRangePipe, PricePipe, PluralPipe, GalleryEditorComponent,
    ],
    templateUrl: './course-form.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './course-form.component.sass'
})
export class CourseFormComponent {
  private store = inject(Store);
  private router = inject(Router);
  private transloco = inject(TranslocoService);
  private notifications = inject(NotificationService);
  private imagesApi = inject(CourseImagesApiService);
  private coursesApi = inject(CourseControllerService);
  private destroyRef = inject(DestroyRef);
  private host = inject(ElementRef<HTMLElement>);
  private browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly steps: StepKey[] = ['basics', 'details', 'photos', 'schedule', 'pricing', 'review'];
  readonly categories = CATEGORIES.map(label => ({ label, key: categoryKey(label), visual: categoryVisual(label) }));
  readonly courseTypes: { value: CourseType; icon: string }[] = [
    { value: 'IN_PERSON', icon: 'storefront' },
    { value: 'ONLINE', icon: 'videocam' },
    { value: 'HYBRID', icon: 'devices' },
  ];
  readonly levels: Level[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  readonly today = new Date();
  readonly categoryKeyOf = categoryKey;

  form = new FormGroup({
    basics: new FormGroup({
      courseType: new FormControl<CourseType>('IN_PERSON', { nonNullable: true, validators: Validators.required }),
      title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5), Validators.maxLength(120)] }),
      category: new FormControl('', { nonNullable: true, validators: Validators.required }),
    }),
    details: new FormGroup({
      description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(30)] }),
      outcomes: new FormControl<string[]>([], { nonNullable: true }),
      prerequisites: new FormControl('', { nonNullable: true }),
    }),
    schedule: new FormGroup({
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required),
      startTime: new FormControl<Date | null>(atTime(10), Validators.required),
      endTime: new FormControl<Date | null>(atTime(17)),
      address: new FormGroup({
        city: new FormControl('', { nonNullable: true, validators: Validators.required }),
        // Optional: only shown on the course page; street, number and city are enough to find the place on the map.
        postalCode: new FormControl('', { nonNullable: true, validators: Validators.pattern(/^\d{2}-\d{3}$/) }),
        street: new FormControl('', { nonNullable: true, validators: Validators.required }),
        streetNumber: new FormControl('', { nonNullable: true, validators: Validators.required }),
        apartmentNumber: new FormControl('', { nonNullable: true }),
        district: new FormControl('', { nonNullable: true }),
      }),
    }),
    pricing: new FormGroup({
      price: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100000)]),
      maxParticipants: new FormControl(10, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(500)] }),
      courseLevel: new FormControl<Level>('BEGINNER', { nonNullable: true }),
      language: new FormControl('pl', { nonNullable: true }),
      certificate: new FormControl(true, { nonNullable: true }),
    }),
  });

  step = signal(0);
  maxReached = signal(0);
  direction = signal<'forward' | 'back'>('forward');
  submitting = signal<'DRAFT' | 'PUBLISHED' | null>(null);
  previewOpen = signal(false);
  draftFound = signal<{ savedAt: string } | null>(null);
  aiLoading = signal(false);
  previousDescription = signal<string | null>(null);
  /** Photos prepared in the browser; they go up once the course exists. The first is the cover. */
  photos = signal<Blob[]>([]);
  coverPreview = signal<string | null>(null);

  private value = toSignal(this.form.valueChanges.pipe(startWith(null), map(() => this.form.getRawValue())), { requireSync: true });
  private currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));
  /** Reactive, so the placeholder title appears once translations load and follows language changes. */
  private placeholderTitle = toSignal(this.transloco.selectTranslate('courseWizard.previewTitle'), { initialValue: '' });

  private cities = toSignal(this.store.select(state => state.course.distinctCities as string[]), { initialValue: [] });
  /** Places this instructor already taught at, from their most recent courses. */
  private recentAddresses = signal<AddressDtoResponse[]>([]);

  stepKey = computed(() => this.steps[this.step()]);
  isOnline = computed(() => this.value().basics.courseType === 'ONLINE');

  /** Cities other courses already run in, matching what is typed, for the address autocomplete. */
  citySuggestions = computed(() => {
    const typed = this.value().schedule.address.city.trim().toLocaleLowerCase();
    return this.cities()
      .filter(city => city.toLocaleLowerCase().includes(typed) && city.toLocaleLowerCase() !== typed)
      .slice(0, 6);
  });

  /** Earlier addresses offered as one-click fills, leaving out the one already in the form. */
  addressSuggestions = computed(() => {
    const current = addressKey(this.value().schedule.address);
    return this.recentAddresses().filter(a => addressKey(a) !== current);
  });

  /** Days and daily hours for the summary under the schedule, once dates and a valid time range are set. */
  scheduleSummary = computed(() => {
    const { startDate, endDate, startTime, endTime } = this.value().schedule;
    if (!startDate || !endDate || !isValidTime(startTime) || !isValidTime(endTime)) return null;
    const minutes = minutesOf(endTime) - minutesOf(startTime);
    if (minutes <= 0) return null;
    const hours = Math.floor(minutes / 60), rest = minutes % 60;
    return {
      days: Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1,
      perDay: [hours && `${hours} h`, rest && `${rest} min`].filter(Boolean).join(' '),
    };
  });

  /** What the catalog card will look like, updated as the instructor types. */
  previewCourse = computed<CourseDtoResponse>(() => {
    const v = this.value();
    const { startDate, endDate, startTime, endTime } = v.schedule;
    return {
      id: 0,
      title: v.basics.title || this.placeholderTitle(),
      courseType: v.basics.courseType,
      category: v.basics.category ? { label: v.basics.category } : undefined,
      address: v.basics.courseType === 'ONLINE' ? undefined : { city: v.schedule.address.city || undefined },
      startDate: startDate ? toLocalIso(startDate, startTime) : toLocalIso(new Date(), startTime),
      endDate: endDate ? toLocalIso(endDate, endTime || startTime) : undefined,
      price: v.pricing.price ?? 0,
      maxParticipants: v.pricing.maxParticipants,
      participantCount: 0,
      creator: this.currentUser(),
      imageUrl: this.coverPreview() ?? undefined,
    };
  });

  constructor() {
    // Phones: the sticky action bar sits at the bottom; lift the floating chat buttons above it.
    const body = inject(DOCUMENT).body;
    body.classList.add('has-bottom-bar');
    this.destroyRef.onDestroy(() => body.classList.remove('has-bottom-bar'));

    // Date picker month/day names follow the UI language.
    const dateAdapter = inject(DateAdapter);
    this.transloco.langChanges$.pipe(takeUntilDestroyed()).subscribe(lang => dateAdapter.setLocale(lang === 'en' ? 'en-GB' : 'pl-PL'));

    // An online course has no address, so its fields must not block the schedule step.
    const address = this.form.controls.schedule.controls.address;
    this.form.controls.basics.controls.courseType.valueChanges.pipe(startWith('IN_PERSON' as CourseType), takeUntilDestroyed())
      .subscribe(type => type === 'ONLINE' ? address.disable({ emitEvent: false }) : address.enable({ emitEvent: false }));

    // Moving the start time moves the end with it, keeping the length of the classes, as calendars do.
    const { startTime, endTime } = this.form.controls.schedule.controls;
    startTime.valueChanges.pipe(startWith(startTime.value), pairwise(), takeUntilDestroyed()).subscribe(([before, after]) => {
      const end = endTime.value;
      if (!isValidTime(before) || !isValidTime(after) || !isValidTime(end)) return;
      const moved = minutesOf(end) + minutesOf(after) - minutesOf(before);
      if (moved > minutesOf(after) && moved < 24 * 60) endTime.setValue(atTime(Math.floor(moved / 60), moved % 60));
    });

    if (this.browser) {
      if (!this.cities().length) this.store.dispatch(new GetDistinctCitiesAction());
      // Instructors usually teach at the same salon; their latest courses supply the address suggestions.
      this.coursesApi.getCourses({ isCurrentCreator: true, hidePast: false, size: 50, sortBy: 'startDate', sortDirection: 'DESC' })
        .pipe(catchError(() => of(null)), takeUntilDestroyed())
        .subscribe(page => this.recentAddresses.set(recentAddressesOf(page?.content ?? [])));
      this.checkDraft();
      this.form.valueChanges.pipe(debounceTime(600), takeUntilDestroyed()).subscribe(() => this.saveDraftLocally());
    }
  }

  // ── Navigation ─────────────────────────────────────────────

  private groupFor(key: StepKey): AbstractControl | null {
    return key === 'review' || key === 'photos' ? null : this.form.controls[key];
  }

  stepValid(index: number): boolean {
    const group = this.groupFor(this.steps[index]);
    return !group || group.valid;
  }

  next(): void {
    const group = this.groupFor(this.stepKey());
    if (group && group.invalid) {
      group.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    if (this.step() < this.steps.length - 1) {
      this.goTo(this.step() + 1);
    }
  }

  back(): void {
    if (this.step() > 0) this.goTo(this.step() - 1);
  }

  goTo(index: number): void {
    if (index > this.maxReached() + 1 || (index > this.step() && !this.stepValid(this.step()))) return;
    this.direction.set(index >= this.step() ? 'forward' : 'back');
    this.step.set(index);
    this.maxReached.update(max => Math.max(max, index));
    if (this.browser) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private focusFirstInvalid(): void {
    setTimeout(() => {
      const el = this.host.nativeElement.querySelector('.step .ng-invalid input, .step .ng-invalid textarea, .step .ng-invalid button, .step input.ng-invalid, .step textarea.ng-invalid') as HTMLElement | null;
      el?.focus();
    });
  }

  // ── Step 1 & 4 helpers ─────────────────────────────────────

  /** Digits only, with the dash added after the first two: "00950" becomes "00-950". */
  useAddress(a: AddressDtoResponse): void {
    const address = this.form.controls.schedule.controls.address;
    address.patchValue({
      street: a.street ?? '', streetNumber: a.streetNumber ?? '', apartmentNumber: a.apartmentNumber ?? '',
      city: a.city ?? '', postalCode: a.postalCode ?? '', district: a.district ?? '',
    });
    address.markAsDirty();
  }

  formatPostalCode(): void {
    const control = this.form.controls.schedule.controls.address.controls.postalCode;
    const digits = control.value.replace(/\D/g, '').slice(0, 5);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
    if (formatted !== control.value) control.setValue(formatted);
  }

  setType(type: CourseType): void {
    this.form.controls.basics.controls.courseType.setValue(type);
  }

  setCategory(label: string): void {
    const control = this.form.controls.basics.controls.category;
    control.setValue(label);
    control.markAsTouched();
  }

  setLevel(level: Level): void {
    this.form.controls.pricing.controls.courseLevel.setValue(level);
  }

  changeSeats(delta: number): void {
    const control = this.form.controls.pricing.controls.maxParticipants;
    control.setValue(Math.min(500, Math.max(1, (control.value || 0) + delta)));
  }

  // ── Step 2: outcomes & AI description ──────────────────────

  addOutcome(event: MatChipInputEvent): void {
    const text = (event.value || '').trim();
    if (text) {
      const control = this.form.controls.details.controls.outcomes;
      control.setValue([...control.value, text]);
    }
    event.chipInput.clear();
  }

  removeOutcome(index: number): void {
    const control = this.form.controls.details.controls.outcomes;
    control.setValue(control.value.filter((_, i) => i !== index));
  }

  suggestDescription(): void {
    const title = this.form.controls.basics.controls.title.value.trim();
    if (!title || this.aiLoading()) return;
    this.aiLoading.set(true);
    this.store.dispatch(new GetAiPromptAction({ prompt: title })).subscribe({
      next: () => {
        const text = this.cleanAiText(this.store.selectSnapshot(s => s.ai.prompt) ?? '', title);
        if (text) {
          const control = this.form.controls.details.controls.description;
          this.previousDescription.set(control.value);
          this.typeInto(control, text);
        } else {
          this.aiFailed();
        }
      },
      error: () => this.aiFailed(),
    });
  }

  private aiFailed(): void {
    this.aiLoading.set(false);
    this.notifications.show(this.transloco.translate('courseWizard.aiUnavailable'));
  }

  undoSuggestion(): void {
    const previous = this.previousDescription();
    if (previous !== null) {
      this.form.controls.details.controls.description.setValue(previous);
      this.previousDescription.set(null);
    }
  }

  /** The description field is plain text: strip Markdown and a first line that just repeats the title. */
  private cleanAiText(text: string, title: string): string {
    const clean = text.replace(/^#+\s*/gm, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/^\s*[-*]\s+/gm, '• ')
      .replace(/^\s*-{3,}\s*$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
    const [first, ...rest] = clean.split('\n');
    return first.trim().toLowerCase() === title.toLowerCase() ? rest.join('\n').trim() : clean;
  }

  /** Reveals the suggestion progressively, like it's being written; instant with reduced motion. */
  private typeInto(control: FormControl<string>, text: string): void {
    const reduced = this.browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      control.setValue(text);
      this.aiLoading.set(false);
      return;
    }
    let i = 0;
    const step = Math.max(3, Math.ceil(text.length / 120));
    const timer = setInterval(() => {
      i = Math.min(text.length, i + step);
      control.setValue(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        control.markAsTouched();
        this.aiLoading.set(false);
      }
    }, 16);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  // ── Draft autosave ─────────────────────────────────────────

  private saveDraftLocally(): void {
    if (!this.form.dirty || this.submitting()) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ value: this.form.getRawValue(), step: this.step(), savedAt: new Date().toISOString() }));
    } catch { /* storage full or blocked: autosave is best effort */ }
  }

  private checkDraft(): void {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) this.draftFound.set({ savedAt: JSON.parse(raw).savedAt });
    } catch { /* ignore unreadable drafts */ }
  }

  restoreDraft(): void {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
      if (draft?.value) {
        const v = draft.value;
        v.schedule.startDate = v.schedule.startDate ? new Date(v.schedule.startDate) : null;
        v.schedule.endDate = v.schedule.endDate ? new Date(v.schedule.endDate) : null;
        v.schedule.startTime = draftTime(v.schedule.startTime);
        v.schedule.endTime = draftTime(v.schedule.endTime);
        this.form.patchValue(v);
        this.form.markAsDirty();
        this.maxReached.set(Math.min(draft.step ?? 0, this.steps.length - 1));
        this.goTo(draft.step ?? 0);
      }
    } catch { /* ignore unreadable drafts */ }
    this.draftFound.set(null);
  }

  discardDraft(): void {
    this.clearDraft();
    this.draftFound.set(null);
  }

  private clearDraft(): void {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }

  // ── Submit ─────────────────────────────────────────────────

  save(status: 'DRAFT' | 'PUBLISHED'): void {
    if (status === 'PUBLISHED' && this.form.invalid) {
      const firstInvalid = this.steps.findIndex((_, i) => !this.stepValid(i));
      this.form.markAllAsTouched();
      if (firstInvalid >= 0) this.goTo(firstInvalid);
      return;
    }
    this.submitting.set(status);
    this.store.dispatch(new SaveCourseAction(this.buildPayload(status))).pipe(
      // The course exists now: send its photos. A failed upload doesn't undo the course;
      // the photos can be added again from the course page.
      switchMap(() => {
        const courseId = this.store.selectSnapshot(state => state.course.course)?.id;
        if (!this.photos().length || courseId == null) return of(true);
        return this.imagesApi.upload(courseId, this.photos()).pipe(last(), map(() => true), catchError(() => of(false)));
      }),
    ).subscribe({
      next: photosSaved => {
        this.clearDraft();
        this.submitting.set(null);
        if (!photosSaved) this.notifications.show(this.transloco.translate('courseWizard.photosFailed'));
        this.router.navigate(['/creator-courses']);
      },
      error: () => this.submitting.set(null),
    });
  }

  private buildPayload(status: 'DRAFT' | 'PUBLISHED'): any {
    const v = this.form.getRawValue();
    const online = v.basics.courseType === 'ONLINE';
    return {
      title: v.basics.title.trim(),
      description: v.details.description.trim(),
      price: v.pricing.price,
      maxParticipants: v.pricing.maxParticipants,
      courseType: v.basics.courseType,
      courseLevel: v.pricing.courseLevel,
      language: v.pricing.language,
      certificate: v.pricing.certificate,
      learningOutcomes: v.details.outcomes.length ? v.details.outcomes.join('\n') : null,
      prerequisites: v.details.prerequisites.trim() || null,
      status,
      startDate: v.schedule.startDate ? toLocalIso(v.schedule.startDate, v.schedule.startTime) : null,
      endDate: v.schedule.endDate ? toLocalIso(v.schedule.endDate, v.schedule.endTime) : null,
      address: online ? null : {
        city: v.schedule.address.city.trim(),
        postalCode: v.schedule.address.postalCode.trim() || null,
        street: v.schedule.address.street.trim(),
        streetNumber: v.schedule.address.streetNumber.trim(),
        apartmentNumber: v.schedule.address.apartmentNumber.trim() || null,
        district: v.schedule.address.district.trim() || null,
      },
      category: { label: v.basics.category },
    };
  }
}
