import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TicketCreateDto } from '../../../../api/models';
import { CreateTicketAction } from '../../state/ticket.actions';
import { TranslocoModule } from '@jsverse/transloco';
import { SpotlightDirective } from '../../../shared/spotlight.directive';

type TicketType = NonNullable<TicketCreateDto['type']>;

@Component({
    selector: 'app-ticket-create',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, TranslocoModule, SpotlightDirective],
    templateUrl: './ticket-create.component.html',
    styleUrl: './ticket-create.component.sass'
})
export class TicketCreateComponent {
  store = inject(Store);
  fb = inject(FormBuilder);

  ticketTypes: { value: TicketType; icon: string }[] = [
    { value: 'GENERAL_INQUIRY', icon: 'help' },
    { value: 'TECHNICAL_ISSUE', icon: 'build' },
    { value: 'BILLING', icon: 'payments' },
    { value: 'COURSE_COMPLAINT', icon: 'report' },
    { value: 'ACCOUNT', icon: 'person' },
    { value: 'OTHER', icon: 'more_horiz' },
  ];

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    type:        [null as TicketType | null, Validators.required]
  });

  setType(type: TicketType) {
    this.form.controls.type.setValue(type);
    this.form.controls.type.markAsTouched();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(new CreateTicketAction(this.form.value as any));
  }
}
