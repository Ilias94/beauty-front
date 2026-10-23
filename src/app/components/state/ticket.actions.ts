import { AddReplyDto, ResolveTicketDto, TicketCreateDto, TicketStatusUpdateDto } from '../../../api/models';

export class LoadMyTicketsAction {
  static readonly type = '[Ticket] Load My Tickets';
}

export class LoadAllTicketsAction {
  static readonly type = '[Ticket] Load All Tickets';
}

export class LoadTicketDetailAction {
  static readonly type = '[Ticket] Load Detail';
  constructor(public id: number) {}
}

export class CreateTicketAction {
  static readonly type = '[Ticket] Create';
  constructor(public payload: TicketCreateDto) {}
}

export class AddReplyAction {
  static readonly type = '[Ticket] Add Reply';
  constructor(public ticketId: number, public payload: AddReplyDto) {}
}

export class ResolveTicketAction {
  static readonly type = '[Ticket] Resolve';
  constructor(public ticketId: number, public payload: ResolveTicketDto) {}
}

export class UpdateTicketStatusAction {
  static readonly type = '[Ticket] Update Status';
  constructor(public ticketId: number, public payload: TicketStatusUpdateDto) {}
}

export class ClearTicketDetailAction {
  static readonly type = '[Ticket] Clear Detail';
}
