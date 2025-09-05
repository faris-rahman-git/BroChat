import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { ISendMessageUseCase } from '../../../../app/socketUseCase/message/interfaces/ISendMessageUseCase';
import { CustomPayloadType } from '../../../../domain/dtos/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';
import { MessageType } from '@bro/shared';

export class sendMessageController implements ISocketController {
  constructor(private sendMessageUseCase: ISendMessageUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {
      const data = socketRequest.body as MessageType;
      const { id: userId } = socketRequest.user as CustomPayloadType;
      if (!userId) return false;

      const result = await this.sendMessageUseCase.execute(data, userId);

      return result;
    } catch (error) {
      console.error('Error in sendMessageController:', error);
      return false;
    }
  }
}
