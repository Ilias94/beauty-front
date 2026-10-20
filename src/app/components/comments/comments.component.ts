import { Component, inject, input, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearCommentsAction } from '../state/comment.actions';
import { CommentDtoResponse } from '../../../api/models';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { DateRangePipe } from '../../shared/format.pipes';

@Component({
    selector: 'app-comments',
    imports: [TranslocoModule, DateRangePipe, MatIconModule],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.sass'
})
export class CommentsComponent implements OnDestroy {
  store = inject(Store);

  comments = input.required<CommentDtoResponse[]>();
  /** Translation key shown when there are no comments (differs on the course page and in "my reviews"). */
  emptyKey = input('comments.noComments');

  initials(name?: string): string {
    return (name ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || '·';
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ClearCommentsAction());
  }
}
