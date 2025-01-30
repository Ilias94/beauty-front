import { Component } from '@angular/core';
import { CoursesComponent } from '../courses/courses.component';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CoursesComponent],
  templateUrl: './student-courses.component.html',
  styleUrl: './student-courses.component.sass'
})
export class StudentCoursesComponent {

}
