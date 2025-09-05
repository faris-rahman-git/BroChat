import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { ICallReadRepo } from '../../../repositories/call/ICallReadRepo';
import { ICallWriteRepo } from '../../../repositories/call/ICallWriteRepo';
import { ICallRoomRepo } from '../../../repositories/redis/ICallRoomRepo';
import { IWebLeaveRoomUseCase } from '../interfaces/IWebLeaveRoomUseCase';

export class WebLeaveRoomUseCase implements IWebLeaveRoomUseCase {
  constructor(
    private eventQueueService: IEventQueueService,
    private callRoomRepo: ICallRoomRepo,
    private callWriteRepo: ICallWriteRepo,
    private callReadRepo: ICallReadRepo
  ) {}

  async execute(roomId: string, leaver: string): Promise<boolean> {
    try {
      const timeAt = new Date();
      await this.callRoomRepo.removeUserFromRoom(roomId, leaver);
      await this.callRoomRepo.deleteUser(leaver);

      const memberIds = await this.callRoomRepo.getRoomMembers(roomId);

      await this.callWriteRepo.callLeft(roomId, timeAt, leaver);

      //last user left
      if (memberIds.length === 0) {
        await this.callWriteRepo.callEnd(roomId, timeAt);

        const receiversId = (
          await this.callReadRepo.findCallReceivers(roomId)
        ).filter((id) => id.toString() !== leaver.toString());

        void Promise.all(
          receiversId.map((receiverId) =>
            this.eventQueueService.emitWithQueue({
              userId: receiverId,
              event: 'call-cut',
              data: { roomId: roomId },
              isDirect: true,
            })
          )
        );
      }

      await Promise.all(
        memberIds.map((id) =>
          this.eventQueueService.emitWithoutQueue({
            userId: id,
            event: 'web-user-leave',
            data: { userId: leaver },
          })
        )
      );

      return true;
    } catch (err: any) {
      console.log('Error in WebLeaveRoomUseCase: ', err.message);
      return false;
    }
  }
}
