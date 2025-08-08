import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { CallInvite } from '@bro/shared';

export interface ICallInviteUseCase {
  execute(userId: string, data: CallInvite): Promise<ResponseDTO>;
}
