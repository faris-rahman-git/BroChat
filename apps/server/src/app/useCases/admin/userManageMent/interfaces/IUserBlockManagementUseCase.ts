import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

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
