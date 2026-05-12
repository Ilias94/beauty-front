import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  show(message: string): void {
    this.snackBar.open(message, 'X', { duration: 5000 });
  }
}
