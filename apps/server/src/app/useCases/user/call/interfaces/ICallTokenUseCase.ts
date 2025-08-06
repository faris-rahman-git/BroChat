import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface ICallTokenUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
