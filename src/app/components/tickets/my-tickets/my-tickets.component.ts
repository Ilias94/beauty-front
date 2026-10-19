import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TicketState } from '../../state/ticket.state';
import { LoadMyTicketsAction } from '../../state/ticket.actions';
import { TranslocoModule } from '@jsverse/transloco';
import { DateRangePipe } from '../../../shared/format.pipes';
import { ticketStatusTag } from '../ticket-ui';

@Component({
    selector: 'app-my-tickets',
    imports: [MatButtonModule, MatIconModule, RouterLink, TranslocoModule, DateRangePipe],
    templateUrl: './my-tickets.component.html',
    styleUrl: './my-tickets.component.sass'
})
export class MyTicketsComponent implements OnInit {
  store = inject(Store);
  tickets = toSignal(this.store.select(TicketState.myTickets));
  readonly statusTag = ticketStatusTag;

  ngOnInit() {
    this.store.dispatch(new LoadMyTicketsAction());
  }
}
