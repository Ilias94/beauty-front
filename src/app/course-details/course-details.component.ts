import { Component, OnInit, Signal, ViewChild, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetCourseByIdAction } from '../components/state/course.actions';
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
import { CommentDtoResponse, CourseDtoResponse, RatingDto } from '../../api/models';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [MatCardModule,
    MatButtonModule,
    FormlyModule,
    FormlyMaterialModule,
    ReactiveFormsModule,
    CommentsComponent,
    NgxStarsModule,
    GoogleMapsModule,
    CommonModule
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.sass'
})
export class CourseDetailsComponent implements OnInit {



  store = inject(Store)
  activatedRoute = inject(ActivatedRoute)
  course: Signal<CourseDtoResponse> = toSignal(this.store.select(state => state.course.course));
  courseId: number
  comments: Signal<CommentDtoResponse[]> = toSignal(this.store.select(state => state.comment.comments))
  currentUserRating: Signal<RatingDto> = toSignal(this.store.select(state => state.rating.currentUserRating))
  @ViewChild("currentRating")
  currentRatingComponent: NgxStarsComponent;
  @ViewChild("courseRating")
  courseRatingComponent: NgxStarsComponent;
  zoom = 12;
  // center: google.maps.LatLngLiteral = { lat: 52.2297, lng: 21.0122 };




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
  position: google.maps.LatLngLiteral  = { lng: 0, lat: 0 }
  mapOptions: google.maps.MapOptions = { center: { lng: 0, lat: 0 }, mapId: "1" }

  constructor() {
    effect(() => {
      this.currentRatingComponent.setRating(this.currentUserRating().value)
      this.courseRatingComponent.setRating(this.course().rating)
      if (this.course().address) {
         this.mapOptions = { center: { lat: this.course().address.lat, lng: this.course().address.lng }, mapId: "1" }
        this.position = { lat: this.course().address.lat, lng: this.course().address.lng }
      }
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
    const commentDto: CommentDtoResponse = {
      content: this.form.get('comment').value,
      courseId: this.courseId
    }
    this.store.dispatch(new SaveCommentAction(commentDto))
  }

  handleRating(rating: number) {
    this.store.dispatch(new SaveRatingAction({ courseId: this.courseId, value: rating }))
  }

  createMapOptions(course: CourseDtoResponse): google.maps.MapOptions {
    console.log("in createMapPtions")
    if (course.address) {
      return { center: { lat: course.address.lat, lng: course.address.lng }, mapId: "1" }
    }
    return {}
  }

  getPosition(course: CourseDtoResponse): google.maps.LatLngLiteral | google.maps.LatLng | google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral {
    console.log(course + " in getPosition", course)

    return { lat: course.address.lat, lng: course.address.lng }

  }
}
