import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
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
    } catch (err: any) {
      console.log('Error in GetAllTransactionsUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
