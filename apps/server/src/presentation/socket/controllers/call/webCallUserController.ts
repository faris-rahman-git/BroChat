import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IWebCallUserUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebCallUserUseCase';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';
import Peer from 'simple-peer';

export class webCallUserController implements ISocketController {
  constructor(private webCallUserUseCase: IWebCallUserUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {
      const { userToCall, from, signal } = socketRequest.body as {
        userToCall: string;
        from: string;
        signal: Peer.SignalData;
      };

      const result = await this.webCallUserUseCase.execute(
        userToCall,
        from,
        signal
      );
      return result;
    } catch (error) {
      console.error('Error in webCallUserController:', error);
      return false;
    }
  }
}
