import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface ISoftDeleteUserUseCase {
  execute(
    userId: string,
    searchValue: string,
    status: string,
    joinedAt: string,
    page: number
  ): Promise<ResponseDTO>;
}
