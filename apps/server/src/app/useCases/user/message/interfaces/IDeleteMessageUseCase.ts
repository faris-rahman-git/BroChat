import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { DeleteMessageType } from '@bro/shared';

export interface IDeleteMessageUseCase {
  execute(
    messageIds: string[],
    conversationId: string,
    userId: string,
    type: DeleteMessageType
  ): Promise<ResponseDTO>;
}
