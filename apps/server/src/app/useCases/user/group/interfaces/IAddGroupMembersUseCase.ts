import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IAddGroupMembersUseCase {
  execute(
    conversationId: string,
    userId: string,
    newMembersId: string[]
  ): Promise<ResponseDTO>;
}
