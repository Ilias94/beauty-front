import { Component } from '@angular/core';
import { MatCardActions } from "@angular/material/card";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-question-results',
  standalone: true,
  imports: [MatCardActions, RouterModule],
  templateUrl: './question-results.component.html',
  styleUrl: './question-results.component.sass'
})
export class QuestionResultsComponent {
courseId: number = 1;

}
