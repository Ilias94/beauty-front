import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateQuestionAction } from '../state/question.actions';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

type QuestionForm = FormGroup<{
  question: FormControl<string>
  answers: FormArray<AnswerForm>
  priority: FormControl<number>
}>

type AnswerForm = FormGroup<{
  answer: FormControl<string>
  isCorrect: FormControl<boolean>
}>

@Component({
    selector: 'app-edit-questions',
    imports: [
        CommonModule, ReactiveFormsModule, RouterModule,
        MatFormFieldModule, MatInputModule, MatButtonModule,
        MatIconModule, MatCheckboxModule, MatTooltipModule, TranslocoModule,
    ],
    templateUrl: './edit-questions.component.html',
    styleUrl: './edit-questions.component.sass'
})
export class EditQuestionsComponent implements OnInit {
  fb = inject(FormBuilder);
  store = inject(Store);
  activatedRoute = inject(ActivatedRoute);
  courseId: number;

  form = this.fb.group({
    questions: this.fb.array<QuestionForm>([])
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.courseId = +params['courseId'];
    });
  }

  get questions() {
    return this.form.get('questions') as FormArray<QuestionForm>;
  }

  getAnswersArray(questionForm: any): FormArray<AnswerForm> {
    return questionForm.get('answers') as FormArray<AnswerForm>;
  }

  addQuestion(): void {
    const questionForm = this.fb.group({
      question: this.fb.control(''),
      answers: this.fb.array<AnswerForm>([]),
      priority: this.fb.control(this.questions.length)
    }) as QuestionForm;
    this.questions.push(questionForm);
    this.addAnswer(this.questions.length - 1);
    this.addAnswer(this.questions.length - 1);
  }

  addAnswer(questionIndex: number): void {
    const answers = this.questions.at(questionIndex).get('answers') as FormArray<AnswerForm>;
    answers.push(this.fb.group({
      answer: this.fb.control(''),
      isCorrect: this.fb.control(false)
    }) as AnswerForm);
  }

  removeQuestion(questionIndex: number): void {
    this.questions.removeAt(questionIndex);
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.questions.at(questionIndex).get('answers') as FormArray<AnswerForm>;
    answers.removeAt(answerIndex);
  }

  submit(): void {
    const questionDetail = this.form.value.questions?.map(q => ({
      question: q.question,
      priority: q.priority,
      answers: q.answers?.map(a => ({
        content: a.answer,
        correct: a.isCorrect
      }))
    }));
    this.store.dispatch(new CreateQuestionAction({ questionDetail, courseId: this.courseId }));
  }
}
