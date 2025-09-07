import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IGetDeletedUsersUseCase {
  execute(searchValue: string , page: number): Promise<ResponseDTO>;
}
