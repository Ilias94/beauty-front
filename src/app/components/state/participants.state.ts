import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { ParticipantsAction } from '../participants.actions';
import { ParticipantsControllerService } from '../../../api/services';

export class ParticipantsStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<ParticipantsStateModel>({
  name: 'participants',
  defaults
})
@Injectable()
export class ParticipantsState {
  constructor(private participantsControllerService: ParticipantsControllerService) {}

  @Action(GetParticipantsAction)
  add({ getState, setState }: StateContext<ParticipantsStateModel>, { payload }: ParticipantsAction) {
    const state = getState();
    setState({ items: [ ...state.items, payload ] });
  }
}
