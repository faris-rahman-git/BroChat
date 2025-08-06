import Razorpay from 'razorpay';
import { IPaymentService } from '../../../app/providers/user/IPaymentService';
import {
  CreateOrderType,
  verifyPaymentType,
} from '../../../domain/dtos/user/PaymentTypes';
import crypto from 'crypto';

export class PaymentService implements IPaymentService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
  });

  private verifySignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }: verifyPaymentType): boolean {
    const secret = process.env.RAZORPAY_SECRET!;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }

  async createOrder(amount: number): Promise<CreateOrderType> {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await this.razorpay.orders.create(options);

    return {
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt,
    };
  }

  async verifyPayment(data: verifyPaymentType): Promise<boolean> {
    return this.verifySignature({
      razorpay_order_id: data.razorpay_order_id,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_signature: data.razorpay_signature,
    });
  }
}
