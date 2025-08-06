import { ResponseDTO } from '../../../../domain/dtos/return/ResponseDTO';

export interface IRefreshUseCase {
  execute(refreshToken: string): Promise<ResponseDTO>;
}
