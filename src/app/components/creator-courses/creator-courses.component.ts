import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CoursesComponent } from '../courses/courses.component';

@Component({
    selector: 'app-creator-courses',
    imports: [CoursesComponent],
    templateUrl: './creator-courses.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './creator-courses.component.sass'
})
export class CreatorCoursesComponent { }
