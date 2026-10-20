import { Component, DestroyRef, OnInit, Signal, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { GetAutocompleteTitleAction, GetDistinctCitiesAction, GetPageCoursesAction } from '../state/course.actions';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GetCategoriesAction } from '../state/category.actions';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime, Subject } from 'rxjs';
import { CategoryDtoResponse, PageCourseDtoResponse } from '../../../api/models';
import { DownloadFileCsvAction, DownloadFileExcelAction } from '../state/file.actions';
import { SecurityState } from '../state/security.state';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CourseCardComponent, CourseRelation } from './course-card/course-card.component';
import { categoryKey } from '../../shared/category-visual';

type CourseType = 'IN_PERSON' | 'ONLINE' | 'HYBRID';

/**
 * Course grid used in three places: the public catalog, the learner's "my courses"
 * (isCurrentStudent) and the instructor's "my teaching" (isCurrentCreator).
 */
@Component({
    selector: 'app-courses',
    imports: [
        CommonModule,
        MatPaginatorModule,
        MatButtonModule,
        RouterModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatCheckboxModule,
        TranslocoModule,
        CourseCardComponent,
    ],
    templateUrl: './courses.component.html',
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

  page = 0;
  size = 12;
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
  private searchInput = new Subject<string>();

  readonly courseTypes: { value: CourseType | null; key: string }[] = [
    { value: null, key: 'courses.typeAll' },
    { value: 'IN_PERSON', key: 'courses.inPerson' },
    { value: 'ONLINE', key: 'courses.online' },
    { value: 'HYBRID', key: 'courses.hybrid' },
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

  downloadCsvFile(courseId: number): void {
    this.store.dispatch(new DownloadFileCsvAction(courseId));
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
    this.store.dispatch(new GetPageCoursesAction(
      this.page, this.size, this.selectedCategoryId, this.appliedTitle || null,
      this.sortBy, this.direction,
      this.isCurrentCreator(), this.isCurrentStudent(), this.computeHidePast(),
      this.selectedCity, this.selectedCourseType
    )).subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false,
    });
  }
}
