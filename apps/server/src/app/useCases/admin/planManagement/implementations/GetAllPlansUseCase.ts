import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPlanReadRepo } from '../../../../repositories/plan/IPlanReadRepo';
import { IGetAllPlansUseCase } from '../interfaces/IGetAllPlansUseCase';
import { PaymentType } from '@bro/shared';

export class GetAllPlansUseCase implements IGetAllPlansUseCase {
  constructor(private planReadRepo: IPlanReadRepo) {}

  async execute(selectedChild: PaymentType): Promise<ResponseDTO> {
    try {
      const planList = await this.planReadRepo.findPlans(selectedChild);

      return {
        success: true,
        data: {
          planList,
        },
      };
    } catch (err) {
      console.log('Error in GetAllPlansUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
