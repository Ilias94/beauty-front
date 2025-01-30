import { Component, inject, input, OnDestroy } from '@angular/core';
import { CommentDto } from '../../../api/models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngxs/store';
import { ClearCommentsAction } from '../state/comment.actions';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.sass'
})
export class CommentsComponent implements OnDestroy{
  store = inject(Store)
  
  comments = input.required<CommentDto[]>()

  ngOnDestroy(): void {
    this.store.dispatch(new ClearCommentsAction())
  }
}
