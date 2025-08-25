import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGetExclusiveCustomPlanUseCase {
  execute( userId: string): Promise<ResponseDTO>;
}
