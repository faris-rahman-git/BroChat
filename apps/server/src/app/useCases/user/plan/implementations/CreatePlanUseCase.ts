import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IPlanReadRepo } from '../../../../repositories/plan/IPlanReadRepo';
import { IPlanWriteRepo } from '../../../../repositories/plan/IPlanWriteRepo';
import { ICreatePlanUseCase } from '../interfaces/ICreatePlanUseCase';
import { ExclusivePlanType } from '@bro/shared';

export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(
    private planWriteRepo: IPlanWriteRepo,
    private planReadRepo: IPlanReadRepo
  ) {}

  async execute(data: ExclusivePlanType, userId: string): Promise<ResponseDTO> {
    try {
      await this.planWriteRepo.createNewExclusiveUserCustomerPlan(data, userId);
      const planList = await this.planReadRepo.findExclusiveUserCustomer(
        userId
      );

      return {
        success: true,
        data: { planList },
      };
    } catch (err: any) {
      console.log('Error in CreatePlanUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
