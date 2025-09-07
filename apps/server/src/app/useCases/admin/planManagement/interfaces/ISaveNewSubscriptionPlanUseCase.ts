import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { PlanType } from '@bro/shared';

export interface ISaveNewSubscriptionPlanUseCase {
  execute(
    data: Omit<PlanType, '_id' | 'createdAt'>
  ): Promise<ResponseDTO>;
}
