import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { acceptCallApiType } from '@bro/shared';

export interface ICallAcceptUseCase {
  execute(userId: string, data: acceptCallApiType): Promise<ResponseDTO>;
}
