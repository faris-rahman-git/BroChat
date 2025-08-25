import { VerifyInType } from '@bro/shared';
export interface IPaymentWriteRepo {
  savePaymentDetails(data: VerifyInType): Promise<void>;

  saveExclusivePaymentDetails(
    paymentId: string,
    orderId: string,
    exclusiveUserId: string,
    userShare: number,
    adminShare: number
  ): Promise<void>;
}
