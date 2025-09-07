import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IGetAllTransactionsUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
