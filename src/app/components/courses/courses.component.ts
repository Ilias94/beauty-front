import { Component, DestroyRef, OnInit, Signal, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { GetAutocompleteTitleAction, GetDistinctCitiesAction, GetPageCoursesAction } from '../state/course.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetCategoriesAction } from '../state/category.actions';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NgxStarsModule } from 'ngx-stars';
import { CategoryDtoResponse, PageCourseDtoResponse, UserDtoResponse } from '../../../api/models';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreatePaymentAction } from '../state/payment.actions';
import { DownloadFileCsvAction, DownloadFileExcelAction } from '../state/file.actions';
import { SecurityState } from '../state/security.state';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

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
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
        NgxStarsModule,
        MatCardModule,
        MatTooltipModule,
        MatChipsModule,
        MatDividerModule,
        MatSlideToggleModule,
        TranslocoModule,
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

  pageCourses: Signal<PageCourseDtoResponse> = toSignal(this.store.select(state => state.course.pageCourses));
  categories: Signal<CategoryDtoResponse[]> = toSignal(this.store.select(state => state.category.categories));
  titleAutocomplete: Signal<string[]> = toSignal(this.store.select(state => state.course.titleAutocomplete));
  distinctCities: Signal<string[]> = toSignal(this.store.select(state => state.course.distinctCities), { initialValue: [] });
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  page = 0;
  size = 9;
  sortBy: string = null;
  direction: 'ASC' | 'DESC' = null;
  cateogryId: number = null;
  selectedCategoryId: number | null = null;
  selectedSort = '';
  showPast = false;
  selectedCity: string | null = null;
  selectedCourseType: 'IN_PERSON' | 'ONLINE' | 'HYBRID' | null = null;
  autocompleteSubject = new Subject<string>();

  readonly popularCities = ['Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Łódź', 'Katowice', 'Lublin'];

  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  sortOptions: { value: string; label: string }[] = [];

  private readonly cardGradients = [
    'linear-gradient(135deg, #C2185B 0%, #E91E63 100%)',
    'linear-gradient(135deg, #7B1FA2 0%, #CE93D8 100%)',
    'linear-gradient(135deg, #00695C 0%, #4DB6AC 100%)',
    'linear-gradient(135deg, #E65100 0%, #FFA726 100%)',
    'linear-gradient(135deg, #1565C0 0%, #64B5F6 100%)',
    'linear-gradient(135deg, #AD1457 0%, #F48FB1 100%)',
    'linear-gradient(135deg, #4527A0 0%, #9575CD 100%)',
    'linear-gradient(135deg, #00838F 0%, #80DEEA 100%)',
  ];

  ngOnInit(): void {
    this.transloco.selectTranslation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.sortOptions = [
        { value: '', label: this.transloco.translate('courses.sortDefault') },
        { value: 'startDate_DESC', label: this.transloco.translate('courses.sortNewest') },
        { value: 'startDate_ASC', label: this.transloco.translate('courses.sortOldest') },
        { value: 'price_ASC', label: this.transloco.translate('courses.sortPriceLow') },
        { value: 'price_DESC', label: this.transloco.translate('courses.sortPriceHigh') },
        { value: 'rating_DESC', label: this.transloco.translate('courses.sortBestRated') },
        { value: 'title_ASC', label: this.transloco.translate('courses.sortAZ') },
      ];
    });

    this.store.dispatch([
      new GetPageCoursesAction(0, this.size, null, null, null, null, this.isCurrentCreator(), this.isCurrentStudent(), this.computeHidePast(), null, null),
      new GetCategoriesAction(),
      new GetDistinctCitiesAction()
    ]);
    this.autocompleteSubject.pipe(debounceTime(400)).subscribe(text =>
      this.store.dispatch(new GetAutocompleteTitleAction(text))
    );
  }

  isOwner(courseId: number): boolean {
    return !!this.currentUser()?.ownedCourseIds?.includes(courseId);
  }

  isEnrolled(courseId: number): boolean {
    return !!this.currentUser()?.enrolledCourseIds?.includes(courseId);
  }

  isFull(course: { maxParticipants?: number; participantCount?: number }): boolean {
    return (course.participantCount ?? 0) >= (course.maxParticipants ?? 0);
  }

  spotsLeft(course: { maxParticipants?: number; participantCount?: number }): number {
    return Math.max(0, (course.maxParticipants ?? 0) - (course.participantCount ?? 0));
  }

  onCategorySelect(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.cateogryId = categoryId;
    this.page = 0;
    this.refresh();
  }

  onSortChange(value: string): void {
    if (!value) {
      this.sortBy = null;
      this.direction = null;
    } else {
      const [field, dir] = value.split('_');
      this.sortBy = field;
      this.direction = dir as 'ASC' | 'DESC';
    }
    this.page = 0;
    this.refresh();
  }

  selectAutocomplete(title: string): void {
    this.store.dispatch(new GetPageCoursesAction(this.page, this.size, this.cateogryId, title, this.sortBy, this.direction, this.isCurrentCreator(), this.isCurrentStudent(), this.computeHidePast(), this.selectedCity, this.selectedCourseType));
  }

  onCitySelect(city: string): void {
    this.selectedCity = this.selectedCity === city ? null : city;
    this.page = 0;
    this.refresh();
  }

  onCourseTypeSelect(type: 'ONLINE' | 'HYBRID'): void {
    this.selectedCourseType = this.selectedCourseType === type ? null : type;
    this.page = 0;
    this.refresh();
  }

  clearLocationFilters(): void {
    this.selectedCity = null;
    this.selectedCourseType = null;
    this.page = 0;
    this.refresh();
  }

  onShowPastChange(): void {
    this.page = 0;
    this.refresh();
  }

  clearFilter(): void {
    this.refresh();
  }

  changePage(e: PageEvent): void {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.refresh();
  }

  buyCourse(courseId: number): void {
    this.store.dispatch(new CreatePaymentAction({ courseId }));
  }

  downloadExcelFile(courseId: number): void {
    this.store.dispatch(new DownloadFileExcelAction(courseId));
  }

  downloadCsvFile(courseId: number): void {
    this.store.dispatch(new DownloadFileCsvAction(courseId));
  }

  getCardGradient(categoryId?: number): string {
    if (categoryId == null) return this.cardGradients[0];
    return this.cardGradients[categoryId % this.cardGradients.length];
  }

  getCourseStatus(startDate?: string, endDate?: string): 'upcoming' | 'ongoing' | 'past' {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (!start || now < start) return 'upcoming';
    if (end && now > end) return 'past';
    return 'ongoing';
  }

  getSelectedCategoryLabel(): string {
    return this.categories()?.find(c => c.id === this.selectedCategoryId)?.label ?? '';
  }

  translateCategory(label: string): string {
    if (!label) return '';
    const key = 'categories.' + label.toLowerCase().replace(/\s+/g, '_');
    const translated = this.transloco.translate<string>(key);
    return translated === key ? label : translated;
  }

  translateStatus(status: string): string {
    return this.transloco.translate('status.' + status);
  }

  private computeHidePast(): boolean {
    if (this.isCurrentCreator() || this.isCurrentStudent()) return false;
    return !this.showPast;
  }

  private refresh(): void {
    this.store.dispatch(new GetPageCoursesAction(
      this.page, this.size, this.cateogryId, null,
      this.sortBy, this.direction,
      this.isCurrentCreator(), this.isCurrentStudent(), this.computeHidePast(),
      this.selectedCity, this.selectedCourseType
    ));
  }
}
