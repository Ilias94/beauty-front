import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-forbidden',
    imports: [MatIconModule, MatButtonModule, TranslocoModule, RouterModule],
    templateUrl: './forbidden.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './forbidden.component.sass'
})
export class ForbiddenComponent {

}
