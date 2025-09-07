import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { ExclusivePlanType } from '@bro/shared';

export interface ICreatePlanUseCase {
  execute(data: ExclusivePlanType, userId: string): Promise<ResponseDTO>;
}
