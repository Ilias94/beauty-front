import { Component, inject, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { UserDto } from '../../../api/models';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.sass'
})
export class MyAccountComponent {
  store = inject(Store)

  form = new FormGroup({})
  currentUser: Signal<UserDto> = toSignal(this.store.select(state => state.security.currentUser));
}
