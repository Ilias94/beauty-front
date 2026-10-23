/* tslint:disable */
/* eslint-disable */
export interface TicketResolutionDto {
  confidenceScore?: number;
  content?: string;
  matchedDocumentIds?: Array<number>;
  resolvedAt?: string;
  resolvedById?: number;
  resolvedByName?: string;
  source?: string;
}
