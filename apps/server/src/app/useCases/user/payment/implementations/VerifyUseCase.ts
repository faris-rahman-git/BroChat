import { VerifyInType } from '@bro/shared';
import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { PaymentMessages } from '../../../../../domain/enums/user/PaymentMessages';
import { IPaymentService } from '../../../../providers/user/IPaymentService';
import { IPremiumUpdateService } from '../../../../providers/user/IPremiumUpdateService';
import { IPaymentWriteRepo } from '../../../../repositories/payment/IPaymentWriteRepo';
import { IVerifyUseCase } from '../interfaces/IVerifyUseCase';

export class VerifyUseCase implements IVerifyUseCase {
  constructor(
    private paymentService: IPaymentService,
    private premiumUpdateService: IPremiumUpdateService,
    private paymentWriteRepo: IPaymentWriteRepo
  ) {}

  async execute(data: VerifyInType, userId: string): Promise<ResponseDTO> {
    try {
      const isValid = await this.paymentService.verifyPayment({
        razorpay_payment_id: data.paymentId,
        razorpay_order_id: data.orderId,
        razorpay_signature: data.signature,
      });
``
      if (!isValid) {
        return {
          success: false,
          data: { message: PaymentMessages.Not_Valid },
        };
      }

      await this.paymentWriteRepo.savePaymentDetails(data);

      switch (data.feature) {
        case 'premium_group':
          await this.premiumUpdateService.updatePremiumGroup(
            data.conversationId as string,
            userId
          );
          break;

        case 'monthly':
        case 'yearly': {
          const now = new Date();
          const end = new Date(now);

          if (data.feature === 'monthly') {
            end.setMonth(end.getMonth() + 1);
          } else {
            end.setFullYear(end.getFullYear() + 1);
          }

          await this.premiumUpdateService.updateSubscription(userId, {
            isSubscribed: true,
            subscriptionPlan: data.feature,
            subscriptionStart: now,
            subscriptionEnd: end,
          });

          break;
        }
      }

      return {
        success: true,
        data: {},
      };
    } catch (err: any) {
      console.log('Error in VerifyUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
