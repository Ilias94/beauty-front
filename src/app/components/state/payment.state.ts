import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { CreatePaymentAction, PaymentAction } from './payment.actions';
import { PaymentControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { response } from 'express';

export class PaymentStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<PaymentStateModel>({
  name: 'payment',
  defaults
})
@Injectable()
export class PaymentState {
  constructor(private paymentControllerService: PaymentControllerService) { }

  @Action(CreatePaymentAction)
  createPayment({ }: StateContext<PaymentStateModel>, { payment }: CreatePaymentAction) {
    return this.paymentControllerService.createPayment({ body: payment }).pipe(tap(response => {
      console.log('Payment created! Response:', response);
      window.location.href = response.paymentUrl
    }))
  }
}
