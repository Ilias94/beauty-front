import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TicketState } from '../../state/ticket.state';
import { SecurityState } from '../../state/security.state';
import { AddReplyAction, ClearTicketDetailAction, LoadTicketDetailAction, ResolveTicketAction } from '../../state/ticket.actions';
import { TranslocoModule } from '@jsverse/transloco';
import { ticketStatusTag } from '../ticket-ui';

@Component({
    selector: 'app-ticket-detail',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule,
        MatInputModule, DatePipe, TranslocoModule],
    templateUrl: './ticket-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './ticket-detail.component.sass'
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  store = inject(Store);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  ticket = toSignal(this.store.select(TicketState.selectedTicket));
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  readonly statusTag = ticketStatusTag;

  replyForm = this.fb.group({ content: ['', Validators.required] });
  resolveForm = this.fb.group({ content: ['', Validators.required] });

  isSupport() {
    return this.currentUser()?.roles?.includes('SUPPORT') ?? false;
  }

  initials(name?: string | null): string {
    return (name ?? '?').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(new LoadTicketDetailAction(id));
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearTicketDetailAction());
  }

  /** Ctrl/Cmd + Enter sends, like most chat and mail apps. */
  onReplyKey(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.sendReply();
    }
  }

  sendReply() {
    if (this.replyForm.invalid) return;
    this.store.dispatch(new AddReplyAction(this.ticket()!.id, this.replyForm.value as any));
    this.replyForm.reset();
  }

  resolve() {
    if (this.resolveForm.invalid) return;
    this.store.dispatch(new ResolveTicketAction(this.ticket()!.id, this.resolveForm.value as any));
    this.resolveForm.reset();
  }
}
