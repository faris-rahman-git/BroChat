import { IPaymentWriteRepo } from '../../../app/repositories/payment/IPaymentWriteRepo';
import { VerifyInType } from '@bro/shared';
import paymentModel from '../../databases/mongo/db/paymentModel';

export class PaymentWriteRepo implements IPaymentWriteRepo {
  async savePaymentDetails(data: VerifyInType): Promise<void> {
    await paymentModel.create(data);
  }
}
