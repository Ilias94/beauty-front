import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { FilterCoursesByDateAction } from '../state/course.actions';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.sass'
})
export class CalendarComponent implements OnInit {
  store = inject(Store)

  ngOnInit(): void {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD')
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD')
    this.store.dispatch(new FilterCoursesByDateAction(startOfMonth, endOfMonth))
  }

}
