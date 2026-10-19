/** Tag colour (global .tag-* classes) for a ticket status. */
export function ticketStatusTag(status?: string): string {
  switch (status) {
    case 'OPEN': return 'tag-info';
    case 'IN_PROGRESS': return 'tag-warning';
    case 'RESOLVED': return 'tag-success';
    default: return '';
  }
}
