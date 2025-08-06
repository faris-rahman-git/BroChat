import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { updateGroupInfoType } from '@bro/shared';

export interface IUpdateGroupInfoUseCase {
  execute(
    conversationId: string,
    userId: string,
    groupInfo: updateGroupInfoType
  ): Promise<ResponseDTO>;
}
