import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IGetResolvedRepotsUseCase {
  execute(searchValue: string , page: number): Promise<ResponseDTO>;
}
