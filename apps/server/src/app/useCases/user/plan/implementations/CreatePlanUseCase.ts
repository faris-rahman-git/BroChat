import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { ICheckAuthorityService } from '../../../../providers/user/ICheckAuthorityService';
import { IPlanReadRepo } from '../../../../repositories/plan/IPlanReadRepo';
import { IPlanWriteRepo } from '../../../../repositories/plan/IPlanWriteRepo';
import { ICreatePlanUseCase } from '../interfaces/ICreatePlanUseCase';
import { PlanSchemaType } from '@bro/shared';

export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(
    private planWriteRepo: IPlanWriteRepo,
    private planReadRepo: IPlanReadRepo,
    private checkAuthService: ICheckAuthorityService
  ) {}

  async execute(data: PlanSchemaType, userId: string): Promise<ResponseDTO> {
    try {
      const isValid = await this.checkAuthService.verifyExclusivePlanPayment(
        userId
      );
      if (!isValid) {
        return {
          success: false,
          data: { message: 'payment not verified' },
        };
      }
      await this.planWriteRepo.createNewExclusiveUserCustomerPlan(
        {
          description: data.description,
          name: data.planName,
          price: Number(data.price),
          offerPrice: Number(data.offerPrice),
        },
        userId
      );
      const planList = await this.planReadRepo.findExclusiveUserCustomer(
        userId
      );

      return {
        success: true,
        data: { planList },
      };
    } catch (err) {
      console.log('Error in CreatePlanUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
