import { Component, OnInit, Signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetCourseByIdAction } from '../components/state/course.actions';
import { CourseDto } from '../../api/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.sass'
})
export class CourseDetailsComponent implements OnInit{
  store = inject(Store)
  activatedRoute = inject(ActivatedRoute)
  course: Signal<CourseDto> = toSignal(this.store.select(state => state.course.course));

  ngOnInit(): void {
   this.activatedRoute.params.subscribe(params => {
    this.store.dispatch(new GetCourseByIdAction(params['id']))
   })
  }

}
