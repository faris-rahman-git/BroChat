import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPlanWriteRepo } from '../../../../repositories/plan/IPlanWriteRepo';
import { ExclusivePlanType } from '@bro/shared';
import { IEditExclusivePlanUseCase } from '../interfaces/IEditExclusivePlanUseCase';

export class EditExclusivePlanUseCase implements IEditExclusivePlanUseCase {
  constructor(private planWriteRepo: IPlanWriteRepo) {}

  async execute(
    data: ExclusivePlanType & { _id: string }
  ): Promise<ResponseDTO> {
    try {
      await this.planWriteRepo.updateExclusiveCustomerPlan(data);

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
