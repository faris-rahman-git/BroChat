import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPlanReadRepo } from '../../../../repositories/plan/IPlanReadRepo';
import { IPlanWriteRepo } from '../../../../repositories/plan/IPlanWriteRepo';
import { PlanType } from '@bro/shared';
import { ISaveNewSubscriptionPlanUseCase } from '../interfaces/ISaveNewSubscriptionPlanUseCase';

export class SaveNewSubscriptionPlanUseCase
  implements ISaveNewSubscriptionPlanUseCase
{
  constructor(
    private planWriteRepo: IPlanWriteRepo,
    private planReadRepo: IPlanReadRepo
  ) {}

  async execute(
    data: Omit<PlanType, '_id' | 'createdAt'>
  ): Promise<ResponseDTO> {
    try {
      await this.planWriteRepo.saveNewSubscriptionPlan(data);
      const planList = await this.planReadRepo.findPlans(
        'subscription'
      );

      return {
        success: true,
        data: {
          planList,
        },
      };
    } catch (err) {
      console.log('Error in SaveNewSubscriptionPlanUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
