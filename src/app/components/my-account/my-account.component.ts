import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.sass'
})
export class MyAccountComponent {

  form = new FormGroup({})
}
