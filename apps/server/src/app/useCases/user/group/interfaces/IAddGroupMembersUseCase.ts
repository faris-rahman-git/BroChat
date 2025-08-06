import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IAddGroupMembersUseCase {
  execute(
    conversationId: string,
    userId: string,
    newMembersId: string[]
  ): Promise<ResponseDTO>;
}
