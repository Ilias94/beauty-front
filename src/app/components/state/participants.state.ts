import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';

import { ParticipantsControllerService } from '../../../api/services';
import { GetParticipantsAction } from './participants.actions';
import { tap } from 'rxjs';
import { UserDtoResponse } from '../../../api/models';

export class ParticipantsStateModel {
  public participants: UserDtoResponse[];
}

const defaults = {
  participants: []
};

@State<ParticipantsStateModel>({
  name: 'participants',
  defaults
})
@Injectable()
export class ParticipantsState {
  constructor(private participantsControllerService: ParticipantsControllerService) {}

   @Action(GetParticipantsAction)
  getParticipants({ patchState }: StateContext<ParticipantsStateModel>, { courseId }: GetParticipantsAction) {
    return this.participantsControllerService.getParticipants({courseId}).pipe(
      tap((response) => {
        patchState({ participants: response });
      })
    );
  }
}
