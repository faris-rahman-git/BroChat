import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPaymentReadRepo } from '../../../../repositories/payment/IPaymentReadRepo';
import { IGetAllTransactionsUseCase } from '../interfaces/IGetAllTransactionsUseCase';

export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  constructor(private paymentReadRepo: IPaymentReadRepo) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      const data =
        await this.paymentReadRepo.findAllExclusiveUserCustomersTransactions(
          userId
        );
      return {
        success: true,
        data: {
          ...data,
        },
      };
    } catch (err) {
      console.log('Error in GetAllTransactionsUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
