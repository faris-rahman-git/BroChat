import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IDeleteAccountUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
