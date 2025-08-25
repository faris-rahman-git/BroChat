import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IRemoveReactionUseCase {
  execute(
    userId: string,
    messageId: string,
    conversationId: string,
  ): Promise<ResponseDTO>;
}
