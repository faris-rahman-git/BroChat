import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPlanWriteRepo } from '../../../../repositories/plan/IPlanWriteRepo';
import { PlanSchemaType } from '@bro/shared';
import { IEditExclusivePlanUseCase } from '../interfaces/IEditExclusivePlanUseCase';

export class EditExclusivePlanUseCase implements IEditExclusivePlanUseCase {
  constructor(private planWriteRepo: IPlanWriteRepo) {}

  async execute(
    data: PlanSchemaType,
    exclusivePlanId: string,
    userId: string
  ): Promise<ResponseDTO> {
    try {
      await this.planWriteRepo.updateExclusiveCustomerPlan(
        exclusivePlanId,
        {
          description: data.description,
          name: data.planName,
          price: Number(data.price),
          offerPrice: Number(data.offerPrice),
        },
        userId
      );

      return {
        success: true,
      };
    } catch (err) {
      console.log('Error in EditExclusivePlanUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
