import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IEditMessageUseCase } from '../../../../app/socketUseCase/message/interfaces/IEditMessageUseCase';
import { CustomPayloadType } from '../../../../domain/entity/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';
import { EditMessageType } from '@bro/shared';

export class editMessageController implements ISocketController {
  constructor(private editMessageUseCase: IEditMessageUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {
      const data = socketRequest.body as EditMessageType;
      const { id: userId } = socketRequest.user as CustomPayloadType;
      if (!userId) return false;

      const result = await this.editMessageUseCase.execute(data, userId);
      return result;
    } catch (error) {
      console.error('Error in editMessageController:', error);
      return false;
    }
  }
}
