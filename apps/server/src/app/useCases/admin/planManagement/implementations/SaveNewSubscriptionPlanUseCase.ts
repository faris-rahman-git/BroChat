import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
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
    } catch (err: any) {
      console.log('Error in SaveNewSubscriptionPlanUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
