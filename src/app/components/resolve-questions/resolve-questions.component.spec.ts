import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Store } from '@ngxs/store';
import { EMPTY } from 'rxjs';

import { ResolveQuestionsComponent } from './resolve-questions.component';

describe('ResolveQuestionsComponent', () => {
  let component: ResolveQuestionsComponent;
  let fixture: ComponentFixture<ResolveQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveQuestionsComponent, TranslocoTestingModule.forRoot({ langs: {} })],
      providers: [
        provideRouter([]),
        { provide: Store, useValue: { select: () => EMPTY, dispatch: () => EMPTY } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResolveQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
