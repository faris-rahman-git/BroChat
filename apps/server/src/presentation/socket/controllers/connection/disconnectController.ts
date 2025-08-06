import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IDisconnectUseCase } from '../../../../app/socketUseCase/connection/interfaces/IDisconnectUseCase';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class disconnectController implements ISocketController {
  constructor(private disconnectUseCase: IDisconnectUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<any> {
    try {
      const socketId = socketRequest.socketId as string;

      const result = await this.disconnectUseCase.execute(socketId);
      return result;
    } catch (error) {
      console.error('Error in disconnectController:', error);
      return false;
    }
  }
}
