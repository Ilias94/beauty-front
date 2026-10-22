import { Component, OnInit, Signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuestionDtoResponse, UserDtoResponse } from '../../../api/models';
import { FindQuestionByCourseIdAction, DeleteQuestionAction } from '../state/question.actions';
import { SecurityState } from '../state/security.state';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-question-results',
    imports: [RouterModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslocoModule],
    templateUrl: './question-results.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './question-results.component.sass'
})
export class QuestionResultsComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  questions: Signal<QuestionDtoResponse[]> = toSignal(
    this.store.select(state => state.question.questionResponses)
  );
  currentUser: Signal<UserDtoResponse> = toSignal(
    this.store.select(SecurityState.getCurrentUser)
  );

  courseId: number;

  isOwner = computed(() =>
    !!this.currentUser()?.ownedCourseIds?.includes(this.courseId)
  );

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.store.dispatch(new FindQuestionByCourseIdAction(this.courseId));
    });
  }

  deleteQuestion(id: number): void {
    this.store.dispatch(new DeleteQuestionAction(id)).subscribe(() =>
      this.store.dispatch(new FindQuestionByCourseIdAction(this.courseId))
    );
  }
}
