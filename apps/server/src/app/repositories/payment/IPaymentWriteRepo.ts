import { VerifyInType } from '@bro/shared';
export interface IPaymentWriteRepo{
    savePaymentDetails(data: VerifyInType): Promise<void>;
}