import { CreateOrderType, verifyPaymentType } from '../../../domain/dtos/user/PaymentTypes';

export interface IPaymentService {
  createOrder(amount: number): Promise<CreateOrderType>;
  verifyPayment(data: verifyPaymentType): Promise<boolean>;
}
