import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IRemoveGroupMemberUseCase {
  execute(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<ResponseDTO>;
}
