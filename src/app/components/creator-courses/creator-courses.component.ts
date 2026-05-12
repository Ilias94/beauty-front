import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoursesComponent } from '../courses/courses.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-creator-courses',
  standalone: true,
  imports: [CoursesComponent, RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, TranslocoModule],
  templateUrl: './creator-courses.component.html',
  styleUrl: './creator-courses.component.sass'
})
export class CreatorCoursesComponent { }
