import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IRestoreUserUseCase {
  execute(
    userId: string,
    searchValue: string,
    page: number
  ): Promise<ResponseDTO>;
}
