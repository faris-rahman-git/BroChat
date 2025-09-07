import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { ExclusivePlanType } from '@bro/shared';

export interface IEditExclusivePlanUseCase {
  execute(data: ExclusivePlanType & { _id: string }): Promise<ResponseDTO>;
}
