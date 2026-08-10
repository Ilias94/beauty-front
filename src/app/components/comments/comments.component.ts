import { Component, inject, input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngxs/store';
import { ClearCommentsAction } from '../state/comment.actions';
import { CommentDtoResponse } from '../../../api/models';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-comments',
    imports: [CommonModule, MatCardModule, TranslocoModule],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.sass'
})
export class CommentsComponent implements OnDestroy{
  store = inject(Store)
  
  comments = input.required<CommentDtoResponse[]>()

  ngOnDestroy(): void {
    this.store.dispatch(new ClearCommentsAction())
  }
}
