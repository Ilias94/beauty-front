/* tslint:disable */
/* eslint-disable */
import { TicketReplyDto } from '../models/ticket-reply-dto';
import { TicketResolutionDto } from '../models/ticket-resolution-dto';
export interface TicketDto {
  assignedToId?: number;
  assignedToName?: string;
  authorId?: number;
  authorName?: string;
  createdAt?: string;
  description?: string;
  id?: number;
  replies?: Array<TicketReplyDto>;
  resolution?: TicketResolutionDto;
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  title?: string;
  type?: 'GENERAL_INQUIRY' | 'TECHNICAL_ISSUE' | 'BILLING' | 'COURSE_COMPLAINT' | 'ACCOUNT' | 'OTHER';
  updatedAt?: string;
}
