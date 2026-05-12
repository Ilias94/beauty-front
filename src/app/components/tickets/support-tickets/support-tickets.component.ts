import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TicketDto } from '../../../../api/models';
import { TicketState } from '../../state/ticket.state';
import { LoadAllTicketsAction, UpdateTicketStatusAction } from '../../state/ticket.actions';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatChipsModule, MatIconModule, MatSelectModule,
            MatFormFieldModule, FormsModule, RouterLink, DatePipe, TranslocoModule],
  templateUrl: './support-tickets.component.html',
  styleUrl: './support-tickets.component.sass'
})
export class SupportTicketsComponent implements OnInit {
  store = inject(Store);
  allTickets = toSignal(this.store.select(TicketState.allTickets));

  filterStatus: TicketDto['status'] | '' = '';
  displayedColumns = ['id', 'title', 'author', 'type', 'status', 'createdAt', 'actions'];

  readonly statuses: NonNullable<TicketDto['status']>[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  get filtered(): TicketDto[] {
    const tickets = this.allTickets() ?? [];
    return this.filterStatus ? tickets.filter(t => t.status === this.filterStatus) : tickets;
  }

  ngOnInit() {
    this.store.dispatch(new LoadAllTicketsAction());
  }

  changeStatus(ticket: TicketDto, status: NonNullable<TicketDto['status']>) {
    this.store.dispatch(new UpdateTicketStatusAction(ticket.id!, { status }));
  }
}
