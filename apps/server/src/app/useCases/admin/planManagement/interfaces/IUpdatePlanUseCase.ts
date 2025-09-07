import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { PlanType, PaymentType } from '@bro/shared';

export interface IUpdatePlanUseCase {
  execute(
    data: Omit<PlanType, 'createdAt'>,
    selectedChild: PaymentType
  ): Promise<ResponseDTO>;
}
