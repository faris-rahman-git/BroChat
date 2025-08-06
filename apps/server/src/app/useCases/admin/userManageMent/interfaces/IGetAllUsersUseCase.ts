import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGetAllUsersUseCase {
  execute(
    searchValue: string,
    status: string,
    joinedAt: string,
    page: number
  ): Promise<ResponseDTO>;
}
