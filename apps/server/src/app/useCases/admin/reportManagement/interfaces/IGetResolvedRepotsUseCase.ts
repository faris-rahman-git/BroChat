import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGetResolvedRepotsUseCase {
  execute(searchValue: string , page: number): Promise<ResponseDTO>;
}
