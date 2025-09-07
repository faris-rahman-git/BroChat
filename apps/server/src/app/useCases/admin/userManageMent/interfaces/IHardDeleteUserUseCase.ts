import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IHardDeleteUserUseCase {
  execute(
    userId: string,
    searchValue: string,
    page: number
  ): Promise<ResponseDTO>;
}
