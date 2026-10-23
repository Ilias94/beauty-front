import { Component, DestroyRef, ElementRef, OnInit, ViewChild, computed, inject, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { CourseImagesApiService } from '../../services/course-images-api.service';
import { CourseImageDto } from '../../../api/models';
import { ImagePrepError, prepareImage } from '../images/image-prep';
import { S3_BASE } from '../../app.const';

export const MAX_PHOTOS = 8;

interface Photo {
  /** Stable key for tracking: the server id, or a local one until the photo is stored. */
  key: string;
  src: string;
  id?: number;
  blob?: Blob;
  /** 0–100 while uploading, -1 while the browser is still preparing it, null when done. */
  progress: number | null;
}

/**
 * Edits a course's photos. With a `courseId` every change is saved at once (course page);
 * without one the photos stay in the browser and are handed out through `photosChange`,
 * for the course wizard to upload once the course exists. The first photo is the cover.
 */
@Component({
  selector: 'app-gallery-editor',
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, MatIconModule, TranslocoModule],
  templateUrl: './gallery-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gallery-editor.component.sass'
})
export class GalleryEditorComponent implements OnInit {
  courseId = input<number | null>(null);
  /** Local mode: photos chosen earlier (e.g. coming back to the wizard step). */
  initialPhotos = input<Blob[]>([]);

  photosChange = output<Blob[]>();
  /** The cover's address after every change, null without photos (for live previews). */
  coverChange = output<string | null>();

  private api = inject(CourseImagesApiService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  photos = signal<Photo[]>([]);
  dragging = signal(false);
  error = signal<string | null>(null);
  readonly max = MAX_PHOTOS;
  room = computed(() => MAX_PHOTOS - this.photos().length);
  busy = computed(() => this.photos().some(p => p.progress !== null));

  private nextKey = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.photos().forEach(p => p.blob && URL.revokeObjectURL(p.src)));
  }

  ngOnInit(): void {
    const id = this.courseId();
    if (id != null) {
      this.api.list(id).subscribe(images => this.setFromServer(images));
    } else if (this.initialPhotos().length) {
      this.photos.set(this.initialPhotos().map(blob => this.localPhoto(blob)));
    }
  }

  // ── Adding ────────────────────────────────────────────────
  openPicker(): void {
    this.fileInput.nativeElement.click();
  }

  onPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.add(Array.from(input.files ?? []));
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    this.dragging.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.add(Array.from(event.dataTransfer?.files ?? []));
  }

  /** Pasting a screenshot or a copied photo adds it too. */
  onPaste(event: ClipboardEvent): void {
    const files = Array.from(event.clipboardData?.files ?? []).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      event.preventDefault();
      this.add(files);
    }
  }

  async add(files: File[]): Promise<void> {
    this.error.set(null);
    if (!files.length) return;
    if (files.length > this.room()) {
      this.error.set(this.room() === 0 ? 'gallery.errors.full' : 'gallery.errors.tooMany');
      files = files.slice(0, this.room());
      if (!files.length) return;
    }

    // Placeholders straight away, so the grid answers before the photos are ready.
    const placeholders = files.map(() => ({ key: `prep-${this.nextKey++}`, src: '', progress: -1 } as Photo));
    this.photos.update(list => [...list, ...placeholders]);

    const prepared: (Blob | null)[] = await Promise.all(files.map(f => prepareImage(f).catch((e: unknown) => {
      this.error.set(e instanceof ImagePrepError ? `gallery.errors.${e.reason}` : 'gallery.errors.unreadable');
      return null;
    })));
    const blobs = prepared.filter((b): b is Blob => !!b);
    const keys = new Set(placeholders.map(p => p.key));

    if (this.courseId() == null) {
      this.photos.update(list => [...list.filter(p => !keys.has(p.key)), ...blobs.map(b => this.localPhoto(b))]);
      this.emitLocal();
      return;
    }

    // Saved at once: show the prepared photos, filling their rings as the upload goes.
    const uploading = blobs.map(b => ({ ...this.localPhoto(b), progress: 0 }));
    const uploadKeys = new Set(uploading.map(p => p.key));
    this.photos.update(list => [...list.filter(p => !keys.has(p.key)), ...uploading]);
    if (!blobs.length) return;

    this.api.upload(this.courseId()!, blobs).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const pct = Math.round((event.loaded / event.total) * 100);
          this.photos.update(list => list.map(p => uploadKeys.has(p.key) ? { ...p, progress: pct } : p));
        } else if (event.type === HttpEventType.Response && event.body) {
          uploading.forEach(p => URL.revokeObjectURL(p.src));
          this.setFromServer(event.body);
        }
      },
      error: err => {
        uploading.forEach(p => URL.revokeObjectURL(p.src));
        this.photos.update(list => list.filter(p => !uploadKeys.has(p.key)));
        this.error.set(err?.status === 415 ? 'gallery.errors.not-image' : 'gallery.errors.upload');
      },
    });
  }

  // ── Order and removal ─────────────────────────────────────
  dropped(event: CdkDragDrop<Photo[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    this.move(event.previousIndex, event.currentIndex);
  }

  makeCover(index: number): void {
    this.move(index, 0);
  }

  /** Keyboard alternative to dragging. */
  nudge(index: number, by: -1 | 1): void {
    const to = index + by;
    if (to >= 0 && to < this.photos().length) this.move(index, to);
  }

  remove(photo: Photo): void {
    const before = this.photos();
    this.photos.set(before.filter(p => p !== photo));
    if (this.courseId() == null) {
      URL.revokeObjectURL(photo.src);
      this.emitLocal();
      return;
    }
    this.coverChange.emit(this.coverSrc());
    this.api.delete(this.courseId()!, photo.id!).subscribe({
      next: images => this.setFromServer(images),
      error: () => {
        this.photos.set(before);
        this.error.set('gallery.errors.save');
      },
    });
  }

  private move(from: number, to: number): void {
    const before = this.photos();
    const list = [...before];
    moveItemInArray(list, from, to);
    this.photos.set(list);
    this.error.set(null);
    if (this.courseId() == null) {
      this.emitLocal();
      return;
    }
    this.coverChange.emit(this.coverSrc());
    this.api.reorder(this.courseId()!, list.map(p => p.id!)).subscribe({
      error: () => {
        this.photos.set(before);
        this.error.set('gallery.errors.save');
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  private setFromServer(images: CourseImageDto[]): void {
    this.photos.set(images.map(img => ({ key: `img-${img.id}`, id: img.id, src: S3_BASE + img.fileName, progress: null })));
    this.coverChange.emit(this.coverSrc());
  }

  private localPhoto(blob: Blob): Photo {
    return { key: `local-${this.nextKey++}`, src: URL.createObjectURL(blob), blob, progress: null };
  }

  private emitLocal(): void {
    this.photosChange.emit(this.photos().filter(p => p.blob).map(p => p.blob!));
    this.coverChange.emit(this.coverSrc());
  }

  private coverSrc(): string | null {
    return this.photos().find(p => p.src)?.src ?? null;
  }
}
