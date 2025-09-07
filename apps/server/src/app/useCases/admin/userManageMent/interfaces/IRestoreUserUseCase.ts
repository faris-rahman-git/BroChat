import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IRestoreUserUseCase {
  execute(
    userId: string,
    searchValue: string,
    page: number
  ): Promise<ResponseDTO>;
}
