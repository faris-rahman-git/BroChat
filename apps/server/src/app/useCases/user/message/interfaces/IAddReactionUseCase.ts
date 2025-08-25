import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IAddReactionUseCase {
  execute(
    userId: string,
    messageId: string,
    emoji: string,
    conversationId: string
  ): Promise<ResponseDTO>;
}
