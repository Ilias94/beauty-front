import { Component, OnInit, Signal, ViewChild, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetCourseByIdAction } from '../components/state/course.actions';
import { CommentDto, CourseDto, RatingDto } from '../../api/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetCommentsAction, SaveCommentAction } from '../components/state/comment.actions';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { CommentsComponent } from "../components/comments/comments.component";
import { NgxStarsComponent, NgxStarsModule } from 'ngx-stars';
import { GetCurrentUserRatingByCourseIdAction, SaveRatingAction } from '../components/state/rating.actions';


@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [MatCardModule,
    MatButtonModule,
    FormlyModule,
    FormlyMaterialModule,
    ReactiveFormsModule,
    CommentsComponent,
    NgxStarsModule
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.sass'
})
export class CourseDetailsComponent implements OnInit {
  store = inject(Store)
  activatedRoute = inject(ActivatedRoute)
  course: Signal<CourseDto> = toSignal(this.store.select(state => state.course.course));
  courseId: number
  comments: Signal<CommentDto[]> = toSignal(this.store.select(state => state.comment.comments))
  currentUserRating: Signal<RatingDto> = toSignal(this.store.select(state => state.rating.currentUserRating))
  @ViewChild("currentRating")
  currentRatingComponent: NgxStarsComponent;
  @ViewChild("courseRating")
  courseRatingComponent: NgxStarsComponent;



  form = new FormGroup({})
  fields: FormlyFieldConfig[] = [
    {
      key: "comment",
      type: "textarea",
      props: {
        label: "comment",
        placeholder: "enter your comment",
        required: true,
        rows: 5
      }
    }
  ]

  constructor() {
    effect(() => {
      this.currentRatingComponent.setRating(this.currentUserRating().value)
      this.courseRatingComponent.setRating(this.course().rating)
    })
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.courseId = params['id']
      this.store.dispatch(new GetCourseByIdAction(this.courseId))
      this.store.dispatch(new GetCommentsAction(this.courseId))
      this.store.dispatch(new GetCurrentUserRatingByCourseIdAction(this.courseId))
    })
  }

  saveComment() {
    const commentDto: CommentDto = {
      content: this.form.get('comment').value,
      courseId: this.courseId
    }
    this.store.dispatch(new SaveCommentAction(commentDto))
  }

  handleRating(rating: number) {
    this.store.dispatch(new SaveRatingAction({ courseId: this.courseId, value: rating }))
  }

}
