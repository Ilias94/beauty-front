import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FindQuestionByCourseIdAction } from '../state/question.actions';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

type Phase = 'quiz' | 'results';

@Component({
    selector: 'app-resolve-questions',
    imports: [RouterModule, MatButtonModule, MatIconModule, TranslocoModule],
    templateUrl: './resolve-questions.component.html',
    styleUrl: './resolve-questions.component.sass'
})
export class ResolveQuestionsComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  questions = toSignal(
    this.store.select((state: any) => state.question.questionResponses as any[]),
    { initialValue: [] as any[] }
  );

  courseId = 0;
  phase = signal<Phase>('quiz');
  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);

  readonly labels = ['A', 'B', 'C', 'D', 'E'];

  currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  total = computed(() => this.questions().length);
  progress = computed(() => this.total() ? (this.currentIndex() / this.total()) * 100 : 0);
  pct = computed(() => this.total() ? Math.round((this.score() / this.total()) * 100) : 0);

  message = computed(() => {
    const p = this.pct();
    if (p >= 90) return this.transloco.translate('quiz.excellent');
    if (p >= 70) return this.transloco.translate('quiz.great');
    if (p >= 50) return this.transloco.translate('quiz.goodEffort');
    return this.transloco.translate('quiz.keepPracticing');
  });

  trophy = computed(() => this.pct() >= 70 ? 'emoji_events' : this.pct() >= 50 ? 'thumb_up' : 'refresh');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.store.dispatch(new FindQuestionByCourseIdAction(this.courseId));
    });
  }

  pick(i: number): void {
    if (this.answered()) return;
    this.selectedIndex.set(i);
    this.answered.set(true);
    if (this.currentQuestion()?.questionDetail?.answers?.[i]?.correct) {
      this.score.update(s => s + 1);
    }
  }

  next(): void {
    if (this.currentIndex() < this.total() - 1) {
      this.currentIndex.update(n => n + 1);
      this.selectedIndex.set(null);
      this.answered.set(false);
    } else {
      this.phase.set('results');
    }
  }

  retry(): void {
    this.currentIndex.set(0);
    this.selectedIndex.set(null);
    this.answered.set(false);
    this.score.set(0);
    this.phase.set('quiz');
  }
}
