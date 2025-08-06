import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';

export interface ILogoutUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
