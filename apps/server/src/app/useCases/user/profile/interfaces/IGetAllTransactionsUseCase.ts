import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGetAllTransactionsUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
