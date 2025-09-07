import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface ICreateOrderUseCase {
  execute(amount: number): Promise<ResponseDTO>;
}
