import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { callEndApiType } from '@bro/shared';

export interface ICallEndUseCase {
  execute(userId: string, data: callEndApiType): Promise<ResponseDTO>;
}
