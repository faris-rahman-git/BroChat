import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IUserBlockManagementUseCase {
  execute(
    userId: string,
    isBlocked: boolean,
    searchValue: string,
    status: string,
    joinedAt: string,
    page: number
  ): Promise<ResponseDTO>;
}
