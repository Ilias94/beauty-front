import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

/** BCP 47 locale for the active UI language. */
function locale(transloco: TranslocoService): string {
  return transloco.getActiveLang() === 'en' ? 'en-GB' : 'pl-PL';
}

/**
 * Formats a PLN amount the way the active language expects:
 * "1 800 zł" in Polish, "PLN 1,800" in English. 0 becomes the "free" label.
 * Impure so it follows language switches without a reload.
 */
@Pipe({ name: 'price', pure: false })
export class PricePipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(amount: number | null | undefined): string {
    if (amount == null) return '';
    if (amount === 0) return this.transloco.translate('courses.free');
    return new Intl.NumberFormat(locale(this.transloco), {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  }
}

/**
 * Formats a start/end pair compactly: "10–12 cze 2027", "28 cze – 2 lip 2027",
 * or a single date when both fall on the same day.
 */
@Pipe({ name: 'dateRange', pure: false })
export class DateRangePipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(start: string | null | undefined, end?: string | null, withTime = false): string {
    if (!start) return '';
    const from = new Date(start);
    const to = end ? new Date(end) : null;
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    if (withTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    const format = new Intl.DateTimeFormat(locale(this.transloco), options);
    if (!to || (!withTime && from.toDateString() === to.toDateString())) {
      return format.format(from);
    }
    return format.formatRange(from, to);
  }
}
