import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import {  PlanSchemaType } from '@bro/shared';

export interface ICreatePlanUseCase {
  execute(data: PlanSchemaType, userId: string): Promise<ResponseDTO>;
}
