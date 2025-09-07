import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPaymentReadRepo } from '../../../../repositories/payment/IPaymentReadRepo';
import { IGetExclusiveUserPaymentsUseCase } from '../interfaces/IGetExclusiveUserPaymentsUseCase';
import { GetExclusiveUserPaymentsApiType } from '@bro/shared';

export class GetExclusiveUserPaymentsUseCase
  implements IGetExclusiveUserPaymentsUseCase
{
  constructor(private payReadRepo: IPaymentReadRepo) {}

  async execute(data: GetExclusiveUserPaymentsApiType): Promise<ResponseDTO> {
    try {
      const result = await this.payReadRepo.findExclusiveUserPayments(data);

      return {
        success: true,
        data: {
          transactions: result.data,
          totalPages: result.totalPages,
        },
      };
    } catch (err) {
      console.log('Error in GetExclusiveUserPaymentsUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
