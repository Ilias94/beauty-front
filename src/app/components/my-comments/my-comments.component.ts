import { Component, inject, OnInit, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearCommentsAction, GetCurrentUserCommentsAction } from '../state/comment.actions';
import { CommentDto } from '../../../api/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-my-comments',
  standalone: true,
  imports: [CommentsComponent],
  templateUrl: './my-comments.component.html',
  styleUrl: './my-comments.component.sass'
})
export class MyCommentsComponent implements OnInit {
  store = inject(Store)
  comments: Signal<CommentDto[]> = toSignal(this.store.select(state => state.comment.comments));

  ngOnInit(): void {
    this.store.dispatch(new GetCurrentUserCommentsAction())
  }

}
