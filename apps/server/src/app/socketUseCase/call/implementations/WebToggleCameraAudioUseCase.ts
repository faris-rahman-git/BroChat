import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { ICallRoomRepo } from '../../../repositories/redis/ICallRoomRepo';
import { IWebToggleCameraAudioUseCase } from '../interfaces/IWebToggleCameraAudioUseCase';

export class WebToggleCameraAudioUseCase
  implements IWebToggleCameraAudioUseCase
{
  constructor(
    private eventQueueService: IEventQueueService,
    private callRoomRepo: ICallRoomRepo
  ) {}

  async execute(
    roomId: string,
    switchTarget: 'video' | 'audio',
    userId: string
  ): Promise<boolean> {
    try {
      const user = await this.callRoomRepo.getUser(userId);
      if (!user) return false;

      if (switchTarget === 'video') {
        user.video = !user.video;
      } else {
        user.audio = !user.audio;
      }

      await this.callRoomRepo.saveUser(
        userId,
        user.userName,
        user.avatar,
        user.video,
        user.audio
      );

      const memberIds = await this.callRoomRepo.getRoomMembers(roomId);

      await Promise.all(
        memberIds.map((id) =>
          this.eventQueueService.emitWithoutQueue({
            userId: id,
            event: 'web-toggle-camera',
            data: { userId, switchTarget },
          })
        )
      );
      return true;
    } catch (err: any) {
      console.log('Error in WebToggleCameraAudioUseCase: ', err.message);
      return false;
    }
  }
}
