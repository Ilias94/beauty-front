/* tslint:disable */
/* eslint-disable */
export interface TicketCreateDto {
  description: string;
  title: string;
  type: 'GENERAL_INQUIRY' | 'TECHNICAL_ISSUE' | 'BILLING' | 'COURSE_COMPLAINT' | 'ACCOUNT' | 'OTHER';
}
