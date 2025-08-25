import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IPlanReadRepo } from '../../../../repositories/plan/IPlanReadRepo';
import { IPlanWriteRepo } from '../../../../repositories/plan/IPlanWriteRepo';
import { PaymentType, PlanType } from '@bro/shared';
import { IUpdatePlanUseCase } from '../interfaces/IUpdatePlanUseCase';

export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(
    private planWriteRepo: IPlanWriteRepo,
    private planReadRepo: IPlanReadRepo
  ) {}

  async execute(
    data: Omit<PlanType, 'createdAt'>,
    selectedChild: PaymentType
  ): Promise<ResponseDTO> {
    try {
      await this.planWriteRepo.updatePlan(data);
      const planList = await this.planReadRepo.findPlans(
        selectedChild
      );

      return {
        success: true,
        data: {
          planList,
        },
      };
    } catch (err: any) {
      console.log('Error in UpdatePlanUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
