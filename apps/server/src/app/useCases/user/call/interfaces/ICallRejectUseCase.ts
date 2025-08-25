import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { rejectCallApiType } from '@bro/shared';

export interface ICallRejectUseCase {
  execute(userId: string, data: rejectCallApiType): Promise<ResponseDTO>;
}
