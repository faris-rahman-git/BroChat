import { VerifyInType } from '@bro/shared';
import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
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
      if (!isValid) {
        return {
          success: false,
          data: { message: PaymentMessages.Not_Valid },
        };
      }

      await this.paymentWriteRepo.savePaymentDetails(data);
      switch (data.feature) {
        case 'paid_group':
          await this.premiumUpdateService.updatePremiumGroup(
            data.conversationId as string,
            userId
          );
          break;

        case 'subscription':
          const now = new Date();
          const end = new Date(now);

          end.setDate(end.getDate() + (data.duration || 30));

          await this.premiumUpdateService.updateSubscription(userId, {
            isSubscribed: true,
            subscriptionPlan: data.planName || 'Base Plan',
            subscriptionStart: now,
            subscriptionEnd: end,
          });
          break;

        case 'exclusive_user':
          await this.premiumUpdateService.exclusiveUserUpdate(userId);
          break;

        case 'exclusive_user_customer':
          await this.premiumUpdateService.exclusiveUserCustomerUpdate(
            data.paymentId,
            data.orderId,
            data.exclusiveUserId as string,
            data.amount
          );
      }

      return {
        success: true,
        data: {},
      };
    } catch (err) {
      console.log('Error in VerifyUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
