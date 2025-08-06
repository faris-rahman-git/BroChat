import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { getAllPaymetsType } from '@bro/shared';

export interface IGetAllTransactionsUseCase {
  execute(data: getAllPaymetsType): Promise<ResponseDTO>;
}
