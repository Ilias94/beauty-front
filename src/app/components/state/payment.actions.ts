import { CreatePaymentDtoRequest } from "../../../api/models";

export class PaymentAction {
  static readonly type = '[Payment] Add item';
  constructor(public payload: string) { }
}

export class CreatePaymentAction {
  static readonly type = '[CreatePaymentDtoRequest] Create Payment';
  constructor(public payment: CreatePaymentDtoRequest) { }
}
