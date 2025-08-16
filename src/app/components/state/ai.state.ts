import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import {  GetAiPromptAction } from './ai.actions';
import { AiControllerService } from '../../../api/services';
import { tap } from 'rxjs';

export class AiStateModel {
  public prompt: string;
}

const defaults = {
  prompt: null
};

@State<AiStateModel>({
  name: 'ai',
  defaults
})
@Injectable()
export class AiState {
  constructor(private aiController: AiControllerService) {}

  @Action(GetAiPromptAction)
  getPrompt({patchState }: StateContext<AiStateModel>, {prompt}: GetAiPromptAction) {
    return this.aiController.query({body: prompt}).pipe(tap(response => {
      patchState({prompt: response.prompt})
    }))
  }
}
