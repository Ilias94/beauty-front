/* tslint:disable */
/* eslint-disable */
export interface PaymentStatusDtoResponse {
  courseId?: number;
  courseTitle?: string;
  orderId?: string;
  status?: 'IN_PROGRESS' | 'FAILED' | 'SUCCESS';
}
