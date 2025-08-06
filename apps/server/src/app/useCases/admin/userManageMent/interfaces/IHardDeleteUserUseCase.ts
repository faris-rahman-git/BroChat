import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IHardDeleteUserUseCase {
  execute(
    userId: string,
    searchValue: string,
    page: number
  ): Promise<ResponseDTO>;
}
