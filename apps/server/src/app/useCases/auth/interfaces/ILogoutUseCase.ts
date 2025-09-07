import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';

export interface ILogoutUseCase {
  execute(userId: string): Promise<ResponseDTO>;
}
