import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface ICallListUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
