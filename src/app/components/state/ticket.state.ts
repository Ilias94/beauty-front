import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { TicketDto } from '../../../api/models';
import { TicketControllerService } from '../../../api/services';
import {
  AddReplyAction,
  ClearTicketDetailAction,
  CreateTicketAction,
  LoadAllTicketsAction,
  LoadMyTicketsAction,
  LoadTicketDetailAction,
  ResolveTicketAction,
  UpdateTicketStatusAction
} from './ticket.actions';

export class TicketStateModel {
  myTickets: TicketDto[];
  allTickets: TicketDto[];
  selectedTicket: TicketDto | null;
}

const defaults: TicketStateModel = {
  myTickets: [],
  allTickets: [],
  selectedTicket: null
};

@State<TicketStateModel>({
  name: 'ticket',
  defaults
})
@Injectable()
export class TicketState {

  constructor(private ticketService: TicketControllerService) {}

  @Selector()
  static myTickets(state: TicketStateModel) { return state.myTickets; }

  @Selector()
  static allTickets(state: TicketStateModel) { return state.allTickets; }

  @Selector()
  static selectedTicket(state: TicketStateModel) { return state.selectedTicket; }

  @Action(LoadMyTicketsAction)
  loadMyTickets({ patchState }: StateContext<TicketStateModel>) {
    return this.ticketService.getMyTickets().pipe(
      tap(myTickets => patchState({ myTickets }))
    );
  }

  @Action(LoadAllTicketsAction)
  loadAllTickets({ patchState }: StateContext<TicketStateModel>) {
    return this.ticketService.getAllTickets().pipe(
      tap(allTickets => patchState({ allTickets }))
    );
  }

  @Action(LoadTicketDetailAction)
  loadDetail({ patchState }: StateContext<TicketStateModel>, { id }: LoadTicketDetailAction) {
    return this.ticketService.getById({ id }).pipe(
      tap(selectedTicket => patchState({ selectedTicket }))
    );
  }

  @Action(CreateTicketAction)
  create({ dispatch }: StateContext<TicketStateModel>, { payload }: CreateTicketAction) {
    return this.ticketService.createTicket({ body: payload }).pipe(
      tap(() => dispatch(new Navigate(['/my-tickets'])))
    );
  }

  @Action(AddReplyAction)
  addReply({ patchState }: StateContext<TicketStateModel>, { ticketId, payload }: AddReplyAction) {
    return this.ticketService.addReply({ id: ticketId, body: payload }).pipe(
      tap(selectedTicket => patchState({ selectedTicket }))
    );
  }

  @Action(ResolveTicketAction)
  resolve({ patchState }: StateContext<TicketStateModel>, { ticketId, payload }: ResolveTicketAction) {
    return this.ticketService.resolveTicket({ id: ticketId, body: payload }).pipe(
      tap(selectedTicket => patchState({ selectedTicket }))
    );
  }

  @Action(UpdateTicketStatusAction)
  updateStatus({ patchState, getState }: StateContext<TicketStateModel>, { ticketId, payload }: UpdateTicketStatusAction) {
    return this.ticketService.updateStatus({ id: ticketId, body: payload }).pipe(
      tap(updated => {
        const allTickets = getState().allTickets.map(t => t.id === updated.id ? updated : t);
        patchState({ allTickets, selectedTicket: updated });
      })
    );
  }

  @Action(ClearTicketDetailAction)
  clearDetail({ patchState }: StateContext<TicketStateModel>) {
    patchState({ selectedTicket: null });
  }
}
