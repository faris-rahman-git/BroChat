import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { callLeftApiType } from '@bro/shared';

export interface ICallLeftUseCase {
  execute(userId: string, data: callLeftApiType): Promise<ResponseDTO>;
}
