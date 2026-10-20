import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { CourseDtoResponse } from '../../../../api/models';
import { DateRangePipe, PricePipe } from '../../../shared/format.pipes';
import { categoryKey, categoryVisual } from '../../../shared/category-visual';
import { S3_BASE } from '../../../app.const';

export type CourseRelation = 'owner' | 'enrolled' | null;

/** One course in a grid. The whole card links to the course page; owner tools sit in the footer. */
@Component({
  selector: 'app-course-card',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, TranslocoModule, DecimalPipe, PricePipe, DateRangePipe],
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
