import { Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CourseDtoResponse } from '../../../../api/models';
import { DateRangePipe, PricePipe } from '../../../shared/format.pipes';
import { categoryKey, categoryVisual } from '../../../shared/category-visual';
import { S3_BASE } from '../../../app.const';
import { SpotlightDirective } from '../../../shared/spotlight.directive';
import { PluralPipe } from '../../../shared/plural.pipe';

export type CourseRelation = 'owner' | 'enrolled' | null;

/** One course in a grid. The whole card links to the course page; owner tools sit in the footer. */
@Component({
  selector: 'app-course-card',
  imports: [SpotlightDirective, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, TranslocoModule, DecimalPipe, PricePipe, DateRangePipe, PluralPipe],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.sass'
})
export class CourseCardComponent {
  course = input.required<CourseDtoResponse>();
  relation = input<CourseRelation>(null);
  /** Live preview (course wizard): no link and no owner tools. */
  preview = input(false);

  downloadExcel = output<number>();
  downloadCsv = output<number>();

  visual = computed(() => categoryVisual(this.course().category?.label));
  categoryKey = computed(() => categoryKey(this.course().category?.label));

  imageSrc = computed(() => {
    const url = this.course().imageUrl;
    if (!url) return null;
    return url.startsWith('http') ? url : S3_BASE + url;
  });

  creatorAvatar = computed(() => {
    const fileName = this.course().creator?.fileName;
    return fileName ? S3_BASE + fileName : null;
  });

  spotsLeft = computed(() =>
    Math.max(0, (this.course().maxParticipants ?? 0) - (this.course().participantCount ?? 0)));

  fillPercent = computed(() => {
    const max = this.course().maxParticipants ?? 0;
    return max ? Math.min(100, Math.round(((this.course().participantCount ?? 0) / max) * 100)) : 0;
  });

  private lang = toSignal(inject(TranslocoService).langChanges$, { initialValue: 'pl' });

  /** The calendar page on the cover: start month and day, a short year only when it isn't this one, and the start time. */
  dateTile = computed(() => {
    const raw = this.course().startDate;
    if (!raw) return null;
    const start = new Date(raw);
    const lang = this.lang();
    const time = start.getHours() || start.getMinutes()
      ? start.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })
      : null;
    return {
      month: new Intl.DateTimeFormat(lang, { month: 'short' }).format(start).replace('.', '').toUpperCase(),
      day: start.getDate(),
      year: start.getFullYear() !== new Date().getFullYear() ? String(start.getFullYear()).slice(-2) : null,
      time,
    };
  });

  /** Length in calendar days (both ends count), shown in weeks from two weeks on. */
  duration = computed(() => {
    const { startDate, endDate } = this.course();
    if (!startDate || !endDate) return null;
    const day = (d: string) => { const x = new Date(d); return Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()); };
    const days = Math.round((day(endDate) - day(startDate)) / 86_400_000) + 1;
    if (days < 1) return null;
    return days < 14
      ? { key: 'courses.durationDays', count: days }
      : { key: 'courses.durationWeeks', count: Math.round(days / 7) };
  });

  status = computed<'upcoming' | 'ongoing' | 'past'>(() => {
    const now = new Date();
    const start = this.course().startDate ? new Date(this.course().startDate!) : null;
    const end = this.course().endDate ? new Date(this.course().endDate!) : null;
    if (!start || now < start) return 'upcoming';
    if (end && now > end) return 'past';
    return 'ongoing';
  });

  onTool(event: Event, action: 'excel' | 'csv') {
    event.stopPropagation();
    const id = this.course().id!;
    if (action === 'excel') {
      this.downloadExcel.emit(id);
    } else {
      this.downloadCsv.emit(id);
    }
  }
}
