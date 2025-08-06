import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGetDeletedRepotsUseCase {
  execute(searchValue: string , page: number): Promise<ResponseDTO>;
}
