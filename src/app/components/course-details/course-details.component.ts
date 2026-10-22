import { Component, DestroyRef, ElementRef, OnInit, Signal, ViewChild, computed, effect, inject, signal, DOCUMENT } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetCourseByIdAction } from '../state/course.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { GetCommentsAction, SaveCommentAction } from '../state/comment.actions';
import { CommentsComponent } from '../comments/comments.component';
import { GetCurrentUserRatingByCourseIdAction, GetRatingSummaryAction, SaveRatingAction } from '../state/rating.actions';
import { CommentDtoResponse, CourseDtoResponse, CourseImageDto, RatingDto, UserDtoResponse } from '../../../api/models';
import { GoogleMapsModule } from '@angular/google-maps';
import { DecimalPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CourseOnlineComponent } from '../course-online/course-online.component';
import { AddVideoAction } from '../state/video.actions';
import { SecurityState } from '../state/security.state';
import { CreatePaymentAction } from '../state/payment.actions';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ChatContact, OpenChatAction } from '../state/chat.actions';
import { ChatApiService } from '../../services/chat-api.service';
import { CourseGroupChatComponent } from '../course-group-chat/course-group-chat.component';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { DateRangePipe, PricePipe } from '../../shared/format.pipes';
import { PluralPipe } from '../../shared/plural.pipe';
import { categoryKey, categoryVisual } from '../../shared/category-visual';
import { S3_BASE } from '../../app.const';
import { CourseGalleryComponent } from '../../shared/course-gallery/course-gallery.component';
import { GalleryEditDialogComponent } from '../../shared/gallery-editor/gallery-edit-dialog.component';
import { CourseImagesApiService } from '../../services/course-images-api.service';

@Component({
    selector: 'app-course-details',
    imports: [
        MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule,
        RouterModule, ReactiveFormsModule, CommentsComponent, GoogleMapsModule, DecimalPipe,
        TranslocoModule, CourseGroupChatComponent, StarRatingComponent, PricePipe, DateRangePipe, PluralPipe,
        CourseGalleryComponent,
    ],
    templateUrl: './course-details.component.html',
    styleUrl: './course-details.component.sass'
})
export class CourseDetailsComponent implements OnInit {

  store = inject(Store);
  activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private chatApi = inject(ChatApiService);

  /** Owner only: this course's participants (from the messaging contacts), each with a "Write" button. */
  participants = signal<ChatContact[] | null>(null);

  course: Signal<CourseDtoResponse | undefined> = toSignal(this.store.select(state => state.course.course));
  comments: Signal<CommentDtoResponse[]> = toSignal(this.store.select(state => state.comment.comments), { initialValue: [] });
  currentUserRating: Signal<RatingDto | undefined> = toSignal(this.store.select(state => state.rating.currentUserRating));
  currentUser: Signal<UserDtoResponse | undefined> = toSignal(this.store.select(SecurityState.getCurrentUser));
  private ratingSummary = toSignal(this.store.select(state => state.rating.summary));
  private imagesApi = inject(CourseImagesApiService);
  private gallery = signal<CourseImageDto[] | null>(null);
  /** Photo addresses for the gallery; a course with a cover but no gallery entries shows just the cover. */
  photos = computed(() => {
    const images = this.gallery();
    if (images?.length) return images.map(img => S3_BASE + img.fileName);
    const cover = this.imageSrc();
    return cover ? [cover] : [];
  });

  courseId!: number;
  /** The store keeps the previously opened course until the new one arrives. */
  loaded = computed(() => this.course()?.id != null && String(this.course()!.id) === String(this.courseId));

  zoom = 15;
  mapOptions: google.maps.MapOptions = { mapId: '3f141cd4fa2bff29fb6f46f8', disableDefaultUI: true, zoomControl: true };
  position = signal<google.maps.LatLngLiteral | null>(null);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  visual = computed(() => categoryVisual(this.course()?.category?.label));
  categoryKey = computed(() => categoryKey(this.course()?.category?.label));
  imageSrc = computed(() => {
    const url = this.course()?.imageUrl;
    if (!url) return null;
    return url.startsWith('http') ? url : S3_BASE + url;
  });
  creatorAvatar = computed(() => {
    const fileName = this.course()?.creator?.fileName;
    return fileName ? S3_BASE + fileName : null;
  });

  isOwner = computed(() => !!this.currentUser()?.ownedCourseIds?.includes(this.course()?.id!));
  isEnrolled = computed(() => !!this.currentUser()?.enrolledCourseIds?.includes(this.course()?.id!));
  spotsLeft = computed(() => {
    const c = this.course();
    return c ? Math.max(0, (c.maxParticipants ?? 0) - (c.participantCount ?? 0)) : 0;
  });
  isFull = computed(() => !!this.course() && this.spotsLeft() === 0);
  fillPercent = computed(() => {
    const c = this.course();
    const max = c?.maxParticipants ?? 0;
    return max ? Math.min(100, Math.round(((c?.participantCount ?? 0) / max) * 100)) : 0;
  });
  status = computed<'upcoming' | 'ongoing' | 'past'>(() => {
    const c = this.course();
    const now = new Date();
    const start = c?.startDate ? new Date(c.startDate) : null;
    const end = c?.endDate ? new Date(c.endDate) : null;
    if (!start || now < start) return 'upcoming';
    if (end && now > end) return 'past';
    return 'ongoing';
  });
  /** "Learning outcomes" is free text; one line or semicolon-separated item per bullet. */
  outcomes = computed(() => (this.course()?.learningOutcomes ?? '')
    .split(/\r?\n|;/).map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean));
  /** Long descriptions start folded so the booking card, outcomes and reviews stay within reach. */
  longDescription = computed(() => (this.course()?.description?.length ?? 0) > 700);
  descriptionOpen = signal(false);
  instructorName = computed(() => [this.course()?.creator?.firstName, this.course()?.creator?.lastName].filter(Boolean).join(' '));
  /** This course's ratings: the summary once it has loaded, the course's stored average until then. */
  rating = computed(() => {
    const summary = this.ratingSummary();
    if (summary && String(summary.courseId) === String(this.courseId)) {
      return { average: summary.average ?? 0, count: summary.count ?? 0, counts: summary.counts ?? [] };
    }
    const c = this.course();
    return { average: c?.rating ?? 0, count: c?.ratingCount ?? 0, counts: [] as number[] };
  });
  /** One bar per star level, five stars first. */
  ratingBars = computed(() => {
    const { count, counts } = this.rating();
    return [5, 4, 3, 2, 1].map(stars => {
      const n = counts[stars - 1] ?? 0;
      return { stars, n, percent: count ? Math.round((n / count) * 100) : 0 };
    });
  });
  canReview = computed(() => !!this.currentUser() && this.isEnrolled() && !this.isOwner());
  showMobileBar = computed(() => this.loaded() && !this.isOwner() && !this.isEnrolled() && this.status() !== 'past' && !this.isFull());

  /** Course language is stored as a code ("pl"); show its name in the UI language. */
  languageName(code?: string): string {
    if (!code) return '';
    try {
      const name = new Intl.DisplayNames([this.transloco.getActiveLang()], { type: 'language' }).of(code);
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : code;
    } catch {
      return code;
    }
  }

  reviewControl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(2000)] });
  private pendingInstructorRating: number | null = null;
  instructorRatingPreview = signal<number | null>(null);

  constructor() {
    effect(() => {
      if (!this.loaded() || !this.isOwner()) return;
      const id = this.course()!.id;
      this.chatApi.getContacts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: contacts => this.participants.set(contacts.filter(c => c.courses.some(k => k.courseId === id && k.role === 'PARTICIPANT'))),
        error: () => this.participants.set([]),
      });
    });
    // The floating chat/assistant buttons move up while the mobile booking bar is shown (see styles.sass).
    const body = inject(DOCUMENT).body;
    effect(() => body.classList.toggle('has-bottom-bar', this.showMobileBar()));
    this.destroyRef.onDestroy(() => body.classList.remove('has-bottom-bar'));

    effect(() => {
      const address = this.course()?.address;
      // Addresses that were never geocoded come back as 0,0 (in the Atlantic), so treat that as "no position".
      const known = address?.lat != null && address?.lng != null && !(address.lat === 0 && address.lng === 0);
      this.position.set(known ? { lat: address!.lat!, lng: address!.lng! } : null);
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.courseId = params['id'];
      this.store.dispatch([
        new GetCourseByIdAction(this.courseId),
        new GetCommentsAction(this.courseId),
        new GetRatingSummaryAction(this.courseId),
      ]);
      if (this.store.selectSnapshot(state => state.security.token)) {
        this.store.dispatch(new GetCurrentUserRatingByCourseIdAction(this.courseId));
      }
      this.gallery.set(null);
      this.loadPhotos();
    });
  }

  private loadPhotos(): void {
    this.imagesApi.list(this.courseId).subscribe({ next: images => this.gallery.set(images), error: () => this.gallery.set([]) });
  }

  /** Owner: edit the photos in a dialog; afterwards the gallery and the course (its cover) reload. */
  editPhotos(): void {
    this.dialog.open(GalleryEditDialogComponent, {
      width: '760px',
      maxWidth: '96vw',
      data: { courseId: Number(this.courseId), courseTitle: this.course()?.title },
    }).afterClosed().subscribe(() => {
      this.loadPhotos();
      this.store.dispatch(new GetCourseByIdAction(this.courseId));
    });
  }

  enroll(): void {
    this.store.dispatch(new CreatePaymentAction({ courseId: this.courseId }));
  }

  saveComment(): void {
    if (this.reviewControl.invalid) return;
    this.store.dispatch(new SaveCommentAction({ content: this.reviewControl.value.trim(), courseId: this.courseId }))
      .subscribe(() => this.reviewControl.reset());
  }

  handleRating(rating: number): void {
    this.store.dispatch(new SaveRatingAction({
      courseId: this.courseId,
      value: rating,
      instructorRating: this.pendingInstructorRating ?? undefined
    }));
  }

  handleInstructorRating(rating: number): void {
    this.pendingInstructorRating = rating;
    this.instructorRatingPreview.set(rating);
  }

  openVideos(): void {
    this.dialog.open(CourseOnlineComponent, {
      width: '900px',
      maxWidth: '96vw',
      data: { courseId: this.courseId, courseTitle: this.course()?.title, canEdit: this.isOwner() }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.dispatch(new AddVideoAction(this.courseId, input.files ? Array.from(input.files) : []));
  }

  onUpload(): void {
    this.fileInput.nativeElement.click();
  }

  messageParticipant(person: ChatContact): void {
    const course = this.course()!;
    this.store.dispatch(new OpenChatAction(person.id, person.firstName, person.lastName, person.fileName, { id: course.id!, title: course.title! }));
  }

  messageInstructor(): void {
    const c = this.course()?.creator;
    if (c) {
      const course = this.course()!;
      this.store.dispatch(new OpenChatAction(c.id, c.firstName, c.lastName, c.fileName, { id: course.id!, title: course.title! }));
    }
  }
}
