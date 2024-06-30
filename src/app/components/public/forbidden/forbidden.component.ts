import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.sass'
})
export class ForbiddenComponent {

}
