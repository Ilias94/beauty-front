import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { GalleryEditorComponent } from './gallery-editor.component';

/** The course page's "Edit photos": the gallery editor, saving each change as it is made. */
@Component({
  selector: 'app-gallery-edit-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslocoModule, GalleryEditorComponent],
  template: `
    <div class="head">
      <div>
        <h2 mat-dialog-title>{{ 'gallery.dialogTitle' | transloco }}</h2>
        <p class="sub">{{ data.courseTitle }}</p>
      </div>
      <button mat-icon-button mat-dialog-close [attr.aria-label]="'common.close' | transloco"><mat-icon>close</mat-icon></button>
    </div>
    <mat-dialog-content>
      <app-gallery-editor [courseId]="data.courseId" />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" mat-dialog-close>{{ 'gallery.done' | transloco }}</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
.head
  display: flex
  align-items: flex-start
  justify-content: space-between
  gap: 12px
  padding: 20px 20px 0 24px

h2[mat-dialog-title]
  padding: 0
  margin: 0
  font-size: 24px

.sub
  margin: 4px 0 0
  color: var(--ink-2)
  font-size: 14px

mat-dialog-content
  padding-top: 16px !important
`,
})
export class GalleryEditDialogComponent {
  data: { courseId: number; courseTitle: string } = inject(MAT_DIALOG_DATA);
}
