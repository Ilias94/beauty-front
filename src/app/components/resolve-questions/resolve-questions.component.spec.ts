import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveQuestionsComponent } from './resolve-questions.component';

describe('ResolveQuestionsComponent', () => {
  let component: ResolveQuestionsComponent;
  let fixture: ComponentFixture<ResolveQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveQuestionsComponent]
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
