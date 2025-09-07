import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { getAllPaymetsType } from '@bro/shared';

export interface IGetAllTransactionsUseCase {
  execute(data: getAllPaymetsType): Promise<ResponseDTO>;
}
