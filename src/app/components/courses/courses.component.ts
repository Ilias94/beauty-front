import { Component, OnInit, Signal, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetPageCoursesAction, SignUpCourseAction } from '../state/course.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageCourseDto } from '../../../api/models';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
     RouterModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatSortModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.sass'
})
export class CoursesComponent implements OnInit {
  store = inject(Store)
  pageCourses: Signal<PageCourseDto> = toSignal(this.store.select(state => state.course.pageCourses));
  displayedColumns: string[] = ['id', 'title', 'description', 'startDate', 'endDate', 'maxParticipants',
   'signUP', 'details'];

  ngOnInit(): void {
    this.store.dispatch(new GetPageCoursesAction(0, 10))
  }

  changePage(e: PageEvent) {
    this.store.dispatch(new GetPageCoursesAction(e.pageIndex, e.pageSize))
  }

  signUpCourse(courseId: number) {
    this.store.dispatch(new SignUpCourseAction(courseId))
    
  }
}
