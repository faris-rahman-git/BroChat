import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IBlockReporedUserUseCase {
  execute(
    reportId: string,
    reportedUserId: string,
    note: string,
    
  ): Promise<ResponseDTO>;
}
