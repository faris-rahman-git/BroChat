import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { acceptCallApiType } from '@bro/shared';

export interface ICallAcceptUseCase {
  execute(userId: string, data: acceptCallApiType): Promise<ResponseDTO>;
}
