import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { PaymentType } from '@bro/shared';

export interface IGetAllPlansUseCase {
  execute(selectedChild: PaymentType): Promise<ResponseDTO>;
}
