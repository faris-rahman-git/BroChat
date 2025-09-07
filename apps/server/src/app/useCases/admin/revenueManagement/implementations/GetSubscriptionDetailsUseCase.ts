import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IGetAllTransactionsUseCase } from '../interfaces/IGetAllTransactionsUseCase';
import { getAllPaymetsType } from '@bro/shared';
import { IPaymentReadRepo } from '../../../../repositories/payment/IPaymentReadRepo';

export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  constructor(
    private payReadRepo: IPaymentReadRepo,
    private queryService: IQueryService
  ) {}

  async execute(data: getAllPaymetsType): Promise<ResponseDTO> {
    try {
      const searchQuery = this.queryService.searchQueryForRevenue({
        searchValue: data.searchValue,
        type: data.type,
        createdAt: data.createdAt,
      });

      const transactions = await this.payReadRepo.getAllTransactions(
        searchQuery,
        data.page
      );

      return {
        success: true,
        data: {
          transactions: transactions.data,
          totalPages: transactions.totalPages,
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
