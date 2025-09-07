import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IGetExclusiveCustomPlanUseCase {
  execute( userId: string): Promise<ResponseDTO>;
}
