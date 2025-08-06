import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IUserConnectedUseCase } from '../../../../app/socketUseCase/connection/interfaces/IUserConnectedUseCase';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class userConnectedController implements ISocketController {
  constructor(private userConnectedUseCase: IUserConnectedUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<any> {
    try {
      const userId = socketRequest.body as string;

      if (!userId) return false;

      const socketId = socketRequest.socketId as string;

      const result = await this.userConnectedUseCase.execute(socketId, userId);
      return result;
    } catch (error) {
      console.error('Error in userConnectedController:', error);
      return false;
    }
  }
}
