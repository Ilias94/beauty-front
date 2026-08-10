import { Component, DestroyRef, ElementRef, OnInit, Signal, ViewChild, ViewEncapsulation, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetCourseByIdAction } from '../state/course.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetCommentsAction, SaveCommentAction } from '../state/comment.actions';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { CommentsComponent } from '../comments/comments.component';
import { NgxStarsComponent, NgxStarsModule } from 'ngx-stars';
import { GetCurrentUserRatingByCourseIdAction, SaveRatingAction } from '../state/rating.actions';
import { CommentDtoResponse, CourseDtoResponse, RatingDto, UserDtoResponse } from '../../../api/models';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CourseOnlineComponent } from '../course-online/course-online.component';
import { AddVideoAction } from '../state/video.actions';
import { SecurityState } from '../state/security.state';
import { CreatePaymentAction } from '../state/payment.actions';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { OpenChatAction } from '../state/chat.actions';
import { CourseGroupChatComponent } from '../course-group-chat/course-group-chat.component';

@Component({
    selector: 'app-course-details',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatCardModule, MatButtonModule, MatIconModule, MatDialogModule,
        RouterModule, FormlyModule, FormlyMaterialModule, ReactiveFormsModule,
        CommentsComponent, NgxStarsModule, GoogleMapsModule, CommonModule, TranslocoModule,
        CourseGroupChatComponent,
    ],
    templateUrl: './course-details.component.html',
    styleUrl: './course-details.component.sass'
})
export class CourseDetailsComponent implements OnInit {

  store = inject(Store);
  activatedRoute = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  course: Signal<CourseDtoResponse> = toSignal(this.store.select(state => state.course.course));
  comments: Signal<CommentDtoResponse[]> = toSignal(this.store.select(state => state.comment.comments));
  currentUserRating: Signal<RatingDto> = toSignal(this.store.select(state => state.rating.currentUserRating));
  currentUser: Signal<UserDtoResponse> = toSignal(this.store.select(SecurityState.getCurrentUser));

  private destroyRef = inject(DestroyRef);

  courseId: number;
  zoom = 14;
  position: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  mapOptions: google.maps.MapOptions = { center: { lat: 0, lng: 0 }, mapId: '3f141cd4fa2bff29fb6f46f8' };

  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  @ViewChild('currentRating') currentRatingComponent: NgxStarsComponent;
  @ViewChild('currentInstructorRating') currentInstructorRatingComponent: NgxStarsComponent;
  @ViewChild('courseRating') courseRatingComponent: NgxStarsComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isOwner = computed(() => {
    const user = this.currentUser();
    const course = this.course();
    return !!user?.ownedCourseIds?.includes(course?.id);
  });

  isEnrolled = computed(() => {
    const user = this.currentUser();
    const course = this.course();
    return !!user?.enrolledCourseIds?.includes(course?.id);
  });

  isFull = computed(() => {
    const c = this.course();
    return c ? (c.participantCount ?? 0) >= (c.maxParticipants ?? 0) : false;
  });

  spotsLeft = computed(() => {
    const c = this.course();
    return c ? Math.max(0, (c.maxParticipants ?? 0) - (c.participantCount ?? 0)) : 0;
  });

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];

  constructor(private dialog: MatDialog) {
    this.transloco.selectTranslation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.fields = [{
        key: 'comment',
        type: 'textarea',
        props: {
          label: this.transloco.translate('courseDetails.leaveReview'),
          placeholder: this.transloco.translate('courseDetails.commentPlaceholder'),
          required: true,
          rows: 4,
          appearance: 'outline',
        }
      }];
    });

    effect(() => {
      const rating = this.currentUserRating();
      const course = this.course();
      if (this.currentRatingComponent && rating?.value != null) {
        this.currentRatingComponent.setRating(rating.value);
      }
      if (this.courseRatingComponent && course?.rating != null) {
        this.courseRatingComponent.setRating(course.rating);
      }
      if (course?.address?.lat != null) {
        const center = { lat: course.address.lat, lng: course.address.lng };
        this.mapOptions = { center, mapId: '3f141cd4fa2bff29fb6f46f8' };
        this.position = center;
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.courseId = params['id'];
      this.store.dispatch(new GetCourseByIdAction(this.courseId));
      this.store.dispatch(new GetCommentsAction(this.courseId));
      this.store.dispatch(new GetCurrentUserRatingByCourseIdAction(this.courseId));
    });
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

  getStatus(): 'upcoming' | 'ongoing' | 'past' {
    const now = new Date();
    const start = this.course()?.startDate ? new Date(this.course().startDate) : null;
    const end = this.course()?.endDate ? new Date(this.course().endDate) : null;
    if (!start || now < start) return 'upcoming';
    if (end && now > end) return 'past';
    return 'ongoing';
  }

  enroll(): void {
    this.store.dispatch(new CreatePaymentAction({ courseId: this.courseId }));
  }

  saveComment(): void {
    const commentDto: CommentDtoResponse = {
      content: this.form.get('comment').value,
      courseId: this.courseId
    };
    this.store.dispatch(new SaveCommentAction(commentDto));
  }

  private pendingInstructorRating: number | null = null;

  handleRating(rating: number): void {
    this.store.dispatch(new SaveRatingAction({
      courseId: this.courseId,
      value: rating,
      instructorRating: this.pendingInstructorRating ?? undefined
    }));
  }

  handleInstructorRating(rating: number): void {
    this.pendingInstructorRating = rating;
  }

  openDialog(): void {
    this.dialog.open(CourseOnlineComponent, {
      width: '900px',
      data: { courseId: this.courseId }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.dispatch(new AddVideoAction(this.courseId, input.files ? Array.from(input.files) : []));
  }

  onUpload(): void {
    this.fileInput.nativeElement.click();
  }

  messageInstructor(): void {
    const c = this.course().creator;
    this.store.dispatch(new OpenChatAction(c.id, c.firstName, c.lastName, c.fileName));
  }
}
