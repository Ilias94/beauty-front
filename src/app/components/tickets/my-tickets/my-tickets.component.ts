import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TicketState } from '../../state/ticket.state';
import { LoadMyTicketsAction } from '../../state/ticket.actions';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-my-tickets',
    imports: [MatTableModule, MatButtonModule, MatChipsModule, MatIconModule, RouterLink, DatePipe, TranslocoModule],
    templateUrl: './my-tickets.component.html',
    styleUrl: './my-tickets.component.sass'
})
export class MyTicketsComponent implements OnInit {
  store = inject(Store);
  tickets = toSignal(this.store.select(TicketState.myTickets));
  displayedColumns = ['id', 'title', 'type', 'status', 'createdAt', 'actions'];

  ngOnInit() {
    this.store.dispatch(new LoadMyTicketsAction());
  }
}
