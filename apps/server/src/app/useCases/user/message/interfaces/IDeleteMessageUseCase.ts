import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { DeleteMessageType } from '@bro/shared';

export interface IDeleteMessageUseCase {
  execute(
    messageId: string,
    conversationId: string,
    userId: string,
    type: DeleteMessageType
  ): Promise<ResponseDTO>;
}
