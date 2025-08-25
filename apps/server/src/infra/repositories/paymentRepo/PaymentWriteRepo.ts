import { IPaymentWriteRepo } from '../../../app/repositories/payment/IPaymentWriteRepo';
import { VerifyInType } from '@bro/shared';
import paymentModel from '../../databases/mongo/db/paymentModel';

export class PaymentWriteRepo implements IPaymentWriteRepo {
  async savePaymentDetails(data: VerifyInType): Promise<void> {
    await paymentModel.create(data);
  }

  async saveExclusivePaymentDetails(
    paymentId: string,
    orderId: string,
    exclusiveUserId: string,
    userShare: number,
    adminShare: number
  ): Promise<void> {
    await paymentModel.updateOne(
      {
        paymentId: paymentId,
        orderId: orderId,
        feature: 'exclusive_user_customer',
      },
      { $set: { exclusiveDetails: { userShare, adminShare, exclusiveUserId } } }
    );
  }
}
