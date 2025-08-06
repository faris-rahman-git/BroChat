import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGetDeletedUsersUseCase {
  execute(searchValue: string , page: number): Promise<ResponseDTO>;
}
