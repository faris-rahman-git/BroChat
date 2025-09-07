import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IPlanReadRepo } from '../../../../repositories/plan/IPlanReadRepo';
import { IGetAllPlansUseCase } from '../interfaces/IGetAllPlansUseCase';
import { PaymentType } from '@bro/shared';

export class GetAllPlansUseCase implements IGetAllPlansUseCase {
  constructor(private planReadRepo: IPlanReadRepo) {}

  async execute(
    selectedChild: PaymentType,
    userId: string
  ): Promise<ResponseDTO> {
    try {
      let planList;
      if (selectedChild === 'exclusive_user_customer') {
        planList = await this.planReadRepo.findExclusiveUserCustomer(userId);
      } else {
        planList = await this.planReadRepo.findPlans(selectedChild , true);
      }
      return {
        success: true,
        data: { planList },
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
