import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IRemoveGroupMemberUseCase {
  execute(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<ResponseDTO>;
}
