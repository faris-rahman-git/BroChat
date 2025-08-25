import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IPlanReadRepo } from '../../../../repositories/plan/IPlanReadRepo';
import { IGetExclusiveCustomPlanUseCase } from '../interfaces/IGetExclusiveCustomPlanUseCase';

export class GetExclusiveCustomPlanUseCase
  implements IGetExclusiveCustomPlanUseCase
{
  constructor(private planReadRepo: IPlanReadRepo) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      const planList = await this.planReadRepo.findExclusiveUserCustomer(
        userId
      );
      return {
        success: true,
        data: { planList },
      };
    } catch (err: any) {
      console.log('Error in GetAllPlansUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
