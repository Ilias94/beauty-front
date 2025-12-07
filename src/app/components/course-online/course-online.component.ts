import { Component, OnInit, Inject, Signal } from '@angular/core';
import { Store, Select } from '@ngxs/store';

import { Observable } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { VideoDtoResponse } from '../../../api/models';
import { VideoState } from '../state/video.state';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeleteVideoAction, EditVideoDescriptionAction, LoadVideosAction } from '../state/video.actions';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-course-online',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule
  ],

  templateUrl: './course-online.component.html',
  styleUrls: ['./course-online.component.sass'],

})
export class CourseOnlineComponent implements OnInit {


  videos: Signal<VideoDtoResponse[]> = toSignal(this.store.select(state => state.video.videos));

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<CourseOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number } // Przekazujemy ID kursu
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadVideosAction(this.data.courseId));
  }

  close() {
    this.dialogRef.close();
  }

  updateDescription(videoId: number, description: string,) {
    this.store.dispatch(new EditVideoDescriptionAction(videoId, description));
  }

  deleteVideo(videoId: number, courseId: number) {
    this.store.dispatch(new DeleteVideoAction(videoId, courseId));
  }
}
