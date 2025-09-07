import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IWebJoinRoomUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebJoinRoomUseCase';
import { CustomPayloadType } from '../../../../domain/entity/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class webJoinRoomController implements ISocketController {
  constructor(private webJoinRoomUseCase: IWebJoinRoomUseCase) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {
      const { id: userId } = socketRequest.user as CustomPayloadType;
      const { roomId, isVideoCall } = socketRequest.body as {
        roomId: string;
        isVideoCall: boolean;
      };

      const result = await this.webJoinRoomUseCase.execute(
        userId,
        roomId,
        isVideoCall
      );
      return result;
    } catch (error) {
      console.error('Error in webJoinRoomController:', error);
      return false;
    }
  }
}
