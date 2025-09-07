import { ResponseDTO } from '../../../../domain/entity/return/ResponseDTO';

export interface IRefreshUseCase {
  execute(refreshToken: string): Promise<ResponseDTO>;
}
