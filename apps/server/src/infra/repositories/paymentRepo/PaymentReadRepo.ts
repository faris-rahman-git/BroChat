import { IPaymentReadRepo } from '../../../app/repositories/payment/IPaymentReadRepo';
import paymentModel from '../../databases/mongo/db/paymentModel';
import { AllTransactionsOutType } from '@bro/shared';

export class PaymentReadRepo implements IPaymentReadRepo {
  async getAllTransactions(
    query: any,
    page: number
  ): Promise<{
    data: AllTransactionsOutType[];
    totalPages: number;
  }> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const [transactions, count] = await Promise.all([
      paymentModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      paymentModel.countDocuments(query),
    ]);

    const data: AllTransactionsOutType[] = transactions.map((transaction) => ({
      feature: transaction.feature,
      userId: transaction.userId?.toString(),
      conversationId: transaction.conversationId?.toString(),
      orderId: transaction.orderId,
      paymentId: transaction.paymentId,
      signature: transaction.signature,
      amount: transaction.amount,
      recipientEmail: transaction.recipientEmail,
      recipientName: transaction.recipientName,
      createdAt: transaction.createdAt,
    }));

    return {
      data,
      totalPages: Math.ceil(count / pageSize),
    };
  }
}
