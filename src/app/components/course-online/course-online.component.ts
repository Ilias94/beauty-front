import { Component, Inject, OnInit, Signal, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoDtoResponse } from '../../../api/models';
import { DeleteVideoAction, EditVideoDescriptionAction, LoadVideosAction } from '../state/video.actions';

export interface CourseOnlineData {
  courseId: number;
  courseTitle?: string;
  /** The course owner can describe and delete videos; participants only watch. */
  canEdit?: boolean;
}

/** Course video player: the selected video on the left, the playlist on the right. */
@Component({
    selector: 'app-course-online',
    imports: [MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, TranslocoModule],
    templateUrl: './course-online.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./course-online.component.sass']
})
export class CourseOnlineComponent implements OnInit {
  videos: Signal<VideoDtoResponse[]> = toSignal(this.store.select(state => state.video.videos), { initialValue: [] });

  loading = signal(true);
  selectedId = signal<number | null>(null);
  /** Video whose delete button was pressed once and now asks for confirmation. */
  confirmDeleteId = signal<number | null>(null);
  editing = signal(false);

  current = computed(() => {
    const list = this.videos() ?? [];
    return list.find(v => v.id === this.selectedId()) ?? list[0] ?? null;
  });

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<CourseOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseOnlineData
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadVideosAction(this.data.courseId)).subscribe({
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  select(video: VideoDtoResponse): void {
    this.selectedId.set(video.id ?? null);
    this.editing.set(false);
    this.confirmDeleteId.set(null);
  }

  saveDescription(description: string): void {
    const video = this.current();
    if (!video?.id) return;
    this.store.dispatch(new EditVideoDescriptionAction(video.id, description.trim()));
    this.editing.set(false);
  }

  deleteVideo(videoId: number): void {
    if (this.confirmDeleteId() !== videoId) {
      this.confirmDeleteId.set(videoId);
      return;
    }
    this.confirmDeleteId.set(null);
    if (this.selectedId() === videoId) this.selectedId.set(null);
    this.store.dispatch(new DeleteVideoAction(videoId, this.data.courseId));
  }

  close(): void {
    this.dialogRef.close();
  }
}
