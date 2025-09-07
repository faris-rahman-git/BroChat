import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface ISearchUserUseCase {
  execute(searchData: string , userId: string): Promise<ResponseDTO>;
}
