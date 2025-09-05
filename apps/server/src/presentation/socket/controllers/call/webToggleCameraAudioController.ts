import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IWebToggleCameraAudioUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebToggleCameraAudioUseCase';
import { CustomPayloadType } from '../../../../domain/dtos/auth/authTypes';
import { ISocketRequest } from '../../socketHelper/ISocketRequest';

export class webToggleCameraAudioController implements ISocketController {
  constructor(
    private webToggleCameraAudioUseCase: IWebToggleCameraAudioUseCase
  ) {}

  async handle(socketRequest: ISocketRequest): Promise<boolean> {
    try {
      const { id: userId } = socketRequest.user as CustomPayloadType;
      const { roomId, switchTarget } = socketRequest.body as {
        roomId: string;
        switchTarget: 'video' | 'audio';
      };

      const result = await this.webToggleCameraAudioUseCase.execute(
        roomId,
        switchTarget,
        userId
      );
      return result;
    } catch (error) {
      console.error('Error in webToggleCameraAudioController:', error);
      return false;
    }
  }
}
