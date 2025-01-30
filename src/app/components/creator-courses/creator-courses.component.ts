import { Component } from '@angular/core';
import { CoursesComponent } from '../courses/courses.component';

@Component({
  selector: 'app-creator-courses',
  standalone: true,
  imports: [CoursesComponent],
  templateUrl: './creator-courses.component.html',
  styleUrl: './creator-courses.component.sass'
})
export class CreatorCoursesComponent {

}
