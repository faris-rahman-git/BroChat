import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface ISearchUserUseCase {
  execute(searchData: string , userId: string): Promise<ResponseDTO>;
}
