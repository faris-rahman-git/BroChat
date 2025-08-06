import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IStatusUpdateUseCase } from '../../../../app/socketUseCase/message/interfaces/IStatusUpdateUseCase';
import { CustomPayloadType } from '../../../../domain/dtos/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';
import { statusUpdateType } from '../../../../app/dtos/socketTypes';

export class statusUpdateController implements ISocketController {
  constructor(private statusUpdateUseCase: IStatusUpdateUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<any> {
    try {
      const data = socketRequest.body as statusUpdateType;
      const { id: userId } = socketRequest.user as CustomPayloadType;
      if (!userId) return false;

      const result = await this.statusUpdateUseCase.execute(data, userId);
      return result;
    } catch (error) {
      console.error('Error in statusUpdateController:', error);
      return false;
    }
  }
}
