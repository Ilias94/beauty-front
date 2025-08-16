import { Component, OnInit, Signal, inject, input } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAutocompleteTitleAction, GetPageCoursesAction, SignUpCourseAction } from '../state/course.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule, Sort } from '@angular/material/sort';
import { GetCategoriesAction } from '../state/category.actions';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NgxStarsModule } from 'ngx-stars';
import { CategoryDtoResponse, PageCourseDtoResponse } from '../../../api/models';
import { MatCardModule } from '@angular/material/card';
import { CreatePaymentAction } from '../state/payment.actions';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    NgxStarsModule,
    MatCardModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.sass'
})
export class CoursesComponent implements OnInit {


  store = inject(Store)
  isCurrentCreator = input(false)
  isCurrentStudent = input(false)
  pageCourses: Signal<PageCourseDtoResponse> = toSignal(this.store.select(state => state.course.pageCourses));
  displayedColumns: string[] = ['id', 'title', 'category', 'description', 'startDate', 'endDate', 'maxParticipants',
    'signUP', 'details'];

  categories: Signal<CategoryDtoResponse[]> = toSignal(this.store.select(state => state.category.categories));
  page: number;
  size: number;
  sortBy: string;
  direction: 'ASC' | 'DESC';
  cateogryId: number
  titleAutocomplete: Signal<string[]> = toSignal(this.store.select(state => state.course.titleAutocomplete));
  autocompleteSubject: Subject<string> = new Subject<string>()

  ngOnInit(): void {
    this.store.dispatch([new GetPageCoursesAction(0, 10, null, null, null, null, this.isCurrentCreator(), this.isCurrentStudent()), new GetCategoriesAction()])
    this.autocompleteSubject.pipe(debounceTime(500)).subscribe(text => this.store.dispatch([new GetAutocompleteTitleAction(text)]))
  }

  changePage(e: PageEvent) {
    this.page = e.pageIndex
    this.size = e.pageSize
    this.store.dispatch(new GetPageCoursesAction(this.page, this.size, this.cateogryId, null, this.sortBy, this.direction, this.isCurrentCreator(), this.isCurrentStudent()))
  }

  signUpCourse(courseId: number) {
    this.store.dispatch(new SignUpCourseAction(courseId))

  }

  buyCourse(courseId: number) {
    console.log('buyCourse clicked, courseId:', courseId);
    this.store.dispatch(new CreatePaymentAction({courseId:courseId}))
  }
  sortData(sort: Sort) {
    this.sortBy = sort.active
    this.direction = sort.direction == 'asc' ? 'ASC' : 'DESC'
    this.store.dispatch(new GetPageCoursesAction(this.page, this.size, this.cateogryId, null, this.sortBy, this.direction, this.isCurrentCreator(), this.isCurrentStudent()))
  }

  selectCategory(category: CategoryDtoResponse) {
    this.cateogryId = category.id
    this.store.dispatch(new GetPageCoursesAction(this.page, this.size, this.cateogryId, null, this.sortBy, this.direction, this.isCurrentCreator(), this.isCurrentStudent()))
  }

  selectAutocomplete(title: string) {
    this.store.dispatch(new GetPageCoursesAction(this.page, this.size, this.cateogryId, title, this.sortBy, this.direction, this.isCurrentCreator(), this.isCurrentStudent()))
  }

  clearFilter() {
    this.store.dispatch(new GetPageCoursesAction(this.page, this.size, this.cateogryId, null, this.sortBy, this.direction, this.isCurrentCreator(), this.isCurrentStudent()))
  }
}
