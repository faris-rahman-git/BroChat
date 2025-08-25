import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ExclusivePlanType } from '@bro/shared';

export interface IEditExclusivePlanUseCase {
  execute(data: ExclusivePlanType & { _id: string }): Promise<ResponseDTO>;
}
