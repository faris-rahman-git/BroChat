import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IGetDeletedRepotsUseCase {
  execute(searchValue: string , page: number): Promise<ResponseDTO>;
}
