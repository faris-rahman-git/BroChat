import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IWebLeaveRoomUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebLeaveRoomUseCase';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class webLeaveRoomController implements ISocketController {
  constructor(private webLeaveRoomUseCase: IWebLeaveRoomUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {
      const { roomId, leaver } = socketRequest.body as {
        roomId: string;
        leaver: string;
      };

      const result = await this.webLeaveRoomUseCase.execute(roomId, leaver);
      return result;
    } catch (error) {
      console.error('Error in webLeaveRoomController:', error);
      return false;
    }
  }
}
