import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IBlockReporedUserUseCase {
  execute(
    reportId: string,
    reportedUserId: string,
    note: string,
    
  ): Promise<ResponseDTO>;
}
