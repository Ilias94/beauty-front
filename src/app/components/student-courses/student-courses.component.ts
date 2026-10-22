import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CoursesComponent } from '../courses/courses.component';

@Component({
    selector: 'app-student-courses',
    imports: [CoursesComponent],
    templateUrl: './student-courses.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './student-courses.component.sass'
})
export class StudentCoursesComponent {

}
