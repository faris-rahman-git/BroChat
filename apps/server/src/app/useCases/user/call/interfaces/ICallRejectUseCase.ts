import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { rejectCallApiType } from '@bro/shared';

export interface ICallRejectUseCase {
  execute(userId: string, data: rejectCallApiType): Promise<ResponseDTO>;
}
