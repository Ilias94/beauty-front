import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Store } from '@ngxs/store';
import { EMPTY } from 'rxjs';

import { StudentCoursesComponent } from './student-courses.component';

describe('StudentCoursesComponent', () => {
  let component: StudentCoursesComponent;
  let fixture: ComponentFixture<StudentCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCoursesComponent, TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [
        provideRouter([]),
        { provide: Store, useValue: { select: () => EMPTY, dispatch: () => EMPTY } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
