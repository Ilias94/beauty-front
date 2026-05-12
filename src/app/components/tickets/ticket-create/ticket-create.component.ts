import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TicketCreateDto } from '../../../../api/models';
import { CreateTicketAction } from '../../state/ticket.actions';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, RouterLink, TranslocoModule],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.sass'
})
export class TicketCreateComponent {
  store = inject(Store);
  fb = inject(FormBuilder);

  ticketTypes: NonNullable<TicketCreateDto['type']>[] = ['GENERAL_INQUIRY', 'TECHNICAL_ISSUE', 'BILLING', 'COURSE_COMPLAINT', 'ACCOUNT', 'OTHER'];

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    type:        [null as TicketCreateDto['type'] | null, Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    this.store.dispatch(new CreateTicketAction(this.form.value as any));
  }
}
