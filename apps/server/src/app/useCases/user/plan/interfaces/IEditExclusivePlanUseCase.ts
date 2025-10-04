import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { PlanSchemaType } from '@bro/shared';

export interface IEditExclusivePlanUseCase {
  execute(
    data: PlanSchemaType,
    exclusivePlanId: string,
    userId: string
  ): Promise<ResponseDTO>;
}
