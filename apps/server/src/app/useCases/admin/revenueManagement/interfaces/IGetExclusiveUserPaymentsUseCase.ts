import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { GetExclusiveUserPaymentsApiType } from '@bro/shared';

export interface IGetExclusiveUserPaymentsUseCase {
  execute(data: GetExclusiveUserPaymentsApiType): Promise<ResponseDTO>;
}
