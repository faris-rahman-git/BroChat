import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { PaymentType } from '@bro/shared';

export interface IGetAllPlansUseCase {
  execute(selectedChild: PaymentType , userId: string): Promise<ResponseDTO>;
}
