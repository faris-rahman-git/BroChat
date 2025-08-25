import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
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
    } catch (err: any) {
      console.log('Error in EditExclusivePlanUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
