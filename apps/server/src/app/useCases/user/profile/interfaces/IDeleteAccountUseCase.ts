import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IDeleteAccountUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
