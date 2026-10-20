import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TicketDto } from '../../../../api/models';
import { TicketState } from '../../state/ticket.state';
import { LoadAllTicketsAction, UpdateTicketStatusAction } from '../../state/ticket.actions';
import { TranslocoModule } from '@jsverse/transloco';
import { ticketStatusTag } from '../ticket-ui';

type TicketStatus = NonNullable<TicketDto['status']>;

@Component({
    selector: 'app-support-tickets',
    imports: [MatTableModule, MatIconModule, MatSelectModule, DatePipe, TranslocoModule],
    templateUrl: './support-tickets.component.html',
    styleUrl: './support-tickets.component.sass'
})
export class SupportTicketsComponent implements OnInit {
  store = inject(Store);
  private router = inject(Router);
  allTickets = toSignal(this.store.select(TicketState.allTickets), { initialValue: [] as TicketDto[] });

  filterStatus = signal<TicketStatus | ''>('');
  displayedColumns = ['id', 'title', 'author', 'status', 'createdAt', 'actions'];

  readonly statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  readonly statusTag = ticketStatusTag;

  /** Ticket count per status, for the filter tabs. */
  counts = computed(() => {
    const counts: Record<string, number> = {};
    for (const t of this.allTickets() ?? []) counts[t.status ?? ''] = (counts[t.status ?? ''] ?? 0) + 1;
    return counts;
  });

  filtered = computed(() => {
    const tickets = this.allTickets() ?? [];
    const status = this.filterStatus();
    return status ? tickets.filter(t => t.status === status) : tickets;
  });

  ngOnInit() {
    this.store.dispatch(new LoadAllTicketsAction());
  }

  open(ticket: TicketDto) {
    this.router.navigate(['/my-tickets', ticket.id]);
  }

  changeStatus(ticket: TicketDto, status: TicketStatus) {
    this.store.dispatch(new UpdateTicketStatusAction(ticket.id!, { status }));
  }
}
