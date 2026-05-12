import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, TranslocoModule],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.sass'
})
export class PaymentStatusComponent implements OnInit {
   status: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'];
    });
  }

  // helper do kolorów chipa
  statusColor(): 'primary' | 'warn' | 'accent' {
    switch (this.status) {
      case 'SUCCESS': return 'primary';
      case 'FAILED': return 'warn';
      case 'IN_PROGRESS': return 'accent';
      default: return 'accent';
    }
  }

}
