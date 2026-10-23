import { Component, DestroyRef, OnInit, Signal, computed, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { GetAutocompleteTitleAction, GetDistinctCitiesAction, GetPageCoursesAction } from '../state/course.actions';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GetCategoriesAction } from '../state/category.actions';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { catchError, debounceTime, of, Subject } from 'rxjs';
import { CategoryDtoResponse, CourseDtoResponse, PageCourseDtoResponse } from '../../../api/models';
import { CourseControllerService } from '../../../api/services';
import { DownloadFileExcelAction } from '../state/file.actions';
import { SecurityState } from '../state/security.state';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CourseCardComponent, CourseRelation } from './course-card/course-card.component';
import { CategoryVisual, categoryKey, categoryVisual } from '../../shared/category-visual';
import { SpotlightDirective } from '../../shared/spotlight.directive';
import { PluralPipe } from '../../shared/plural.pipe';

type CourseType = 'IN_PERSON' | 'ONLINE' | 'HYBRID';

/** Up to this many personal courses (two rows of cards) show without search and sorting. */
const PERSONAL_LIST_FITS = 6;

/**
 * Course grid used in three places: the public catalog, the learner's "my courses"
 * (isCurrentStudent) and the instructor's "my teaching" (isCurrentCreator).
 */
@Component({
    selector: 'app-courses',
    imports: [
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    FormsModule,
    MatAutocompleteModule,
    MatIconModule,
    TranslocoModule,
    CourseCardComponent,
    SpotlightDirective,
    PluralPipe
],
    templateUrl: './courses.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './courses.component.sass'
})
export class CoursesComponent implements OnInit {

  store = inject(Store);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  isCurrentCreator = input(false);
  isCurrentStudent = input(false);

  pageCourses: Signal<PageCourseDtoResponse | undefined> = toSignal(this.store.select(state => state.course.pageCourses));
  categories: Signal<CategoryDtoResponse[]> = toSignal(this.store.select(state => state.category.categories), { initialValue: [] });
  titleAutocomplete: Signal<string[]> = toSignal(this.store.select(state => state.course.titleAutocomplete), { initialValue: [] });
  distinctCities: Signal<string[]> = toSignal(this.store.select(state => state.course.distinctCities), { initialValue: [] });
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  mode = computed<'catalog' | 'student' | 'creator'>(() =>
    this.isCurrentCreator() ? 'creator' : this.isCurrentStudent() ? 'student' : 'catalog');

  private coursesApi = inject(CourseControllerService);
  /** All of the user's own courses (enrolled or taught), unfiltered: what the personal views can filter by. */
  private ownCourses = signal<CourseDtoResponse[] | null>(null);

  /** The catalogue offers every category; a personal list only those its courses are in. */
  visibleCategories = computed(() => {
    if (this.mode() === 'catalog') return this.categories();
    const ids = new Set((this.ownCourses() ?? []).map(course => course.category?.id));
    return this.categories().filter(category => ids.has(category.id));
  });
  /** Choosing between categories only helps when there are at least two. */
  showCategories = computed(() => this.mode() === 'catalog' || this.visibleCategories().length > 1);
  /** A personal list of a few courses fits on screen: searching and sorting it would be noise. */
  showSearch = computed(() => this.mode() === 'catalog' || (this.ownCourses()?.length ?? 0) > PERSONAL_LIST_FITS);

  page = 0;
  readonly pageSizeOptions = [12, 24, 48];
  size = this.pageSizeOptions[0];
  sortBy: string | null = null;
  direction: 'ASC' | 'DESC' | null = null;
  selectedCategoryId: number | null = null;
  selectedSort = 'default';
  showPast = false;
  selectedCity: string | null = null;
  selectedCourseType: CourseType | null = null;
  /** What is in the search box; appliedTitle is what the list was last loaded with. */
  searchTitle = '';
  private appliedTitle = '';
  loading = true;
  /** Upcoming courses in the whole catalogue, for the header; filters don't change it. */
  catalogTotal: number | null = null;
  private searchInput = new Subject<string>();

  readonly courseTypes: { value: CourseType | null; key: string; icon: string }[] = [
    { value: null, key: 'courses.typeAll', icon: 'apps' },
    { value: 'IN_PERSON', key: 'courses.inPerson', icon: 'location_on' },
    { value: 'ONLINE', key: 'courses.online', icon: 'videocam' },
    { value: 'HYBRID', key: 'courses.hybrid', icon: 'devices' },
  ];

  readonly sortOptions = [
    { value: 'default', key: 'courses.sortDefault' },
    { value: 'startDate_ASC', key: 'courses.sortSoonest' },
    { value: 'price_ASC', key: 'courses.sortPriceLow' },
    { value: 'price_DESC', key: 'courses.sortPriceHigh' },
    { value: 'rating_DESC', key: 'courses.sortBestRated' },
    { value: 'title_ASC', key: 'courses.sortAZ' },
  ];

  readonly skeletons = Array.from({ length: 6 });

  sortLabelKey(): string {
    return this.sortOptions.find(o => o.value === this.selectedSort)?.key ?? 'courses.sortDefault';
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTitle || this.selectedCategoryId || this.selectedCity || this.selectedCourseType || this.showPast);
  }

  ngOnInit(): void {
    this.store.dispatch([new GetCategoriesAction(), new GetDistinctCitiesAction()]);
    this.refresh();
    if (this.mode() !== 'catalog') {
      this.coursesApi.getCourses({ isCurrentCreator: this.isCurrentCreator(), isCurrentStudent: this.isCurrentStudent(), hidePast: false, size: 200 })
        .pipe(catchError(() => of(null)), takeUntilDestroyed(this.destroyRef))
        .subscribe(page => this.ownCourses.set(page?.content ?? []));
    }
    // Search as you type: suggestions and the list follow the box once typing pauses.
    // A single letter would match almost everything, so the list waits for two (or an empty box).
    this.searchInput.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe(text => {
      const title = text.trim();
      if (title.length >= 2) {
        this.store.dispatch(new GetAutocompleteTitleAction(title));
      }
      if (title.length !== 1) {
        this.applyTitle(title);
      }
    });
  }

  relationOf(courseId?: number): CourseRelation {
    if (courseId == null) return null;
    if (this.currentUser()?.ownedCourseIds?.includes(courseId)) return 'owner';
    if (this.currentUser()?.enrolledCourseIds?.includes(courseId)) return 'enrolled';
    return null;
  }

  categoryLabel(category: CategoryDtoResponse): string {
    const key = categoryKey(category.label);
    const translated = this.transloco.translate<string>(key);
    return translated === key ? (category.label ?? '') : translated;
  }

  selectedCategoryLabel(): string {
    const category = this.categories()?.find(c => c.id === this.selectedCategoryId);
    return category ? this.categoryLabel(category) : '';
  }

  /** The category's tint and icon, the same ones its courses use when they have no photo. */
  visualOf(category: CategoryDtoResponse): CategoryVisual {
    return categoryVisual(category.label);
  }

  /** "Kraków · Warszawa +6" for the tag floating by the header art. */
  citiesPreview(): string {
    const cities = this.distinctCities();
    const shown = cities.slice(0, 2).join(' · ');
    return cities.length > 2 ? `${shown} +${cities.length - 2}` : shown;
  }

  typeIndex(): number {
    return Math.max(0, this.courseTypes.findIndex(t => t.value === this.selectedCourseType));
  }

  /** The whole segment opens its select; a click on the select itself already toggles it. */
  openSelect(select: MatSelect, event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('mat-select')) select.open();
  }

  togglePast(): void {
    this.showPast = !this.showPast;
    this.onShowPastChange();
  }

  /** The filters in effect, each with the action that removes only that one. */
  activeChips(): { id: string; label: string; clear: () => void }[] {
    const chips: { id: string; label: string; clear: () => void }[] = [];
    if (this.appliedTitle) chips.push({ id: 'title', label: `„${this.appliedTitle}”`, clear: () => this.clearSearch() });
    if (this.selectedCategoryId) chips.push({ id: 'category', label: this.selectedCategoryLabel(), clear: () => this.onCategorySelect(null) });
    if (this.selectedCity) chips.push({ id: 'city', label: this.selectedCity, clear: () => this.onCitySelect(null) });
    if (this.selectedCourseType) {
      const type = this.courseTypes.find(t => t.value === this.selectedCourseType)!;
      chips.push({ id: 'type', label: this.transloco.translate(type.key), clear: () => this.onCourseTypeSelect(null) });
    }
    if (this.showPast) chips.push({ id: 'past', label: this.transloco.translate('courses.showPastCourses'), clear: () => this.togglePast() });
    return chips;
  }

  onSearchInput(value: string): void {
    this.searchTitle = value;
    this.searchInput.next(value);
  }

  search(title: string = this.searchTitle): void {
    this.searchTitle = title.trim();
    this.applyTitle(this.searchTitle);
  }

  clearSearch(): void {
    this.searchTitle = '';
    this.applyTitle('');
  }

  private applyTitle(title: string): void {
    if (title === this.appliedTitle) return;
    this.appliedTitle = title;
    this.resetAndRefresh();
  }

  onCategorySelect(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.resetAndRefresh();
  }

  onCourseTypeSelect(type: CourseType | null): void {
    this.selectedCourseType = type;
    this.resetAndRefresh();
  }

  onCitySelect(city: string | null): void {
    this.selectedCity = city;
    this.resetAndRefresh();
  }

  onSortChange(value: string): void {
    if (!value || value === 'default') {
      this.sortBy = null;
      this.direction = null;
    } else {
      const [field, dir] = value.split('_');
      this.sortBy = field;
      this.direction = dir as 'ASC' | 'DESC';
    }
    this.resetAndRefresh();
  }

  onShowPastChange(): void {
    this.resetAndRefresh();
  }

  clearAllFilters(): void {
    this.searchTitle = '';
    this.appliedTitle = '';
    this.selectedCategoryId = null;
    this.selectedCity = null;
    this.selectedCourseType = null;
    this.showPast = false;
    this.resetAndRefresh();
  }

  changePage(e: PageEvent): void {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  downloadExcelFile(courseId: number): void {
    this.store.dispatch(new DownloadFileExcelAction(courseId));
  }

  private computeHidePast(): boolean {
    if (this.isCurrentCreator() || this.isCurrentStudent()) return false;
    return !this.showPast;
  }

  private resetAndRefresh(): void {
    this.page = 0;
    this.refresh();
  }

  private refresh(): void {
    this.loading = true;
    const unfiltered = this.mode() === 'catalog' && !this.hasActiveFilters();
    this.store.dispatch(new GetPageCoursesAction(
      this.page, this.size, this.selectedCategoryId, this.appliedTitle || null,
      this.sortBy, this.direction,
      this.isCurrentCreator(), this.isCurrentStudent(), this.computeHidePast(),
      this.selectedCity, this.selectedCourseType
    )).subscribe({
      next: () => {
        this.loading = false;
        if (unfiltered) this.catalogTotal = this.pageCourses()?.totalElements ?? null;
      },
      error: () => this.loading = false,
    });
  }
}
