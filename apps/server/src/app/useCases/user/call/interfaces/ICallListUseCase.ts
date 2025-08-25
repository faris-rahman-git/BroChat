import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface ICallListUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
