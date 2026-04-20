import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateQuestionAction } from '../state/question.actions';
import { QuestionDtoRequest } from '../../../api/models';
import { ActivatedRoute } from '@angular/router';
import { co } from '@fullcalendar/core/internal-common';

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
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-questions.component.html',
  styleUrl: './edit-questions.component.sass'
})
export class EditQuestionsComponent implements OnInit {

  fb = inject(FormBuilder)
  store = inject(Store)
  activatedRoute = inject(ActivatedRoute)
  courseId: number;
  

  form = this.fb.group({
    questions: this.fb.array<QuestionForm>([])
  })
 

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
    this.courseId = params['courseId'];
    })
  }

  get questions() {
    return this.form.get("questions") as FormArray<QuestionForm>
  }


  getAnswersArray(questionForm: any): FormArray<AnswerForm> {
    return questionForm.get('answers') as FormArray<AnswerForm>
  }

  addQuestion() {
    const questionForm = this.fb.group({
      question: this.fb.control(""),
      answers: this.fb.array<AnswerForm>([]),
      priority: this.fb.control(0)
    }) as QuestionForm
    this.questions.push(questionForm)
  }

  addAnswer(questionIndex: number) {
    const answers = this.questions.at(questionIndex).get("answers") as FormArray<AnswerForm>
    const answerForm = this.fb.group({
      answer: this.fb.control(""),
      isCorrect: this.fb.control(false)
    }) as AnswerForm
    answers.push(answerForm)
  }

  removeQuestion(questionIndex: number) {
    this.questions.removeAt(questionIndex)
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const answers = this.questions.at(questionIndex).get("answers") as FormArray<AnswerForm>
    answers.removeAt(answerIndex)
  }

  submit() {
    this.store.dispatch(new CreateQuestionAction({
      questionDetail: this.form.value.questions,
      courseId: this.courseId
    }))
    console.log(this.form.value.questions)
  }
}
