import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IRemoveReactionUseCase {
  execute(
    userId: string,
    messageId: string,
    conversationId: string,
  ): Promise<ResponseDTO>;
}
