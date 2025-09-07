import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { CallInvite } from '@bro/shared';

export interface ICallInviteUseCase {
  execute(userId: string, data: CallInvite): Promise<ResponseDTO>;
}
