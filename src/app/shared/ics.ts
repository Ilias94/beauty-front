import { CourseDtoResponse } from '../../api/models';

/** "2026-10-28T10:00:00" -> "20261028T100000" (local wall time, paired with TZID below). */
function icsDateTime(iso: string): string {
  return iso.slice(0, 19).replace(/[-:]/g, '');
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');
}

/**
 * An iCalendar file for one course, accepted by Google, Apple and Outlook calendars.
 * A multi-day course with the same hours each day becomes a daily series ("10:00–17:00 on 28 and 29 Oct")
 * instead of one event running overnight.
 */
export function courseToIcs(course: CourseDtoResponse, pageUrl: string, location: string): string {
  const start = course.startDate!;
  const end = course.endDate ?? start;
  const days = Math.round((Date.parse(end.slice(0, 10)) - Date.parse(start.slice(0, 10))) / 86_400_000) + 1;
  const daily = days > 1 && end.slice(11, 16) > start.slice(11, 16);
  const firstEnd = daily ? `${start.slice(0, 10)}T${end.slice(11, 19)}` : end;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bellademy//Kursy//PL',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:course-${course.id}@bellademy.pl`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;TZID=Europe/Warsaw:${icsDateTime(start)}`,
    `DTEND;TZID=Europe/Warsaw:${icsDateTime(firstEnd)}`,
    ...(daily ? [`RRULE:FREQ=DAILY;COUNT=${days}`] : []),
    `SUMMARY:${escapeText(course.title ?? 'Kurs Bellademy')}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(pageUrl)}`,
    `URL:${pageUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

export function downloadIcs(course: CourseDtoResponse, pageUrl: string, location: string): void {
  const blob = new Blob([courseToIcs(course, pageUrl, location)], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `bellademy-kurs-${course.id}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
