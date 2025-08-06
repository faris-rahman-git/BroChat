import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface ICreateOrderUseCase {
  execute(amount: number): Promise<ResponseDTO>;
}
