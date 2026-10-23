import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AiState } from './ai.state';
import { GetAiPromptAction } from './ai.actions';
import { AiControllerService } from '../../../api/services';

describe('Ai actions', () => {
  let store: Store;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AiState])],
      providers: [
        { provide: AiControllerService, useValue: { query: () => of({ prompt: 'answer' }) } }
      ]
    }).compileComponents();
    store = TestBed.inject(Store);
  }));

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  it('should store the answer to a prompt', () => {
    store.dispatch(new GetAiPromptAction({ prompt: 'question' }));
    expect(store.selectSnapshot(state => state.ai.prompt)).toEqual('answer');
  });

});
