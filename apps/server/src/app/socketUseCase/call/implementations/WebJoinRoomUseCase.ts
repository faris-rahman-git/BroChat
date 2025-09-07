import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { ICallRoomRepo } from '../../../repositories/redis/ICallRoomRepo';
import { IUserReadRepo } from '../../../repositories/user/IUserReadRepo';
import { IWebJoinRoomUseCase } from '../interfaces/IWebJoinRoomUseCase';
import { ICallReadRepo } from '../../../repositories/call/ICallReadRepo';

export class WebJoinRoomUseCase implements IWebJoinRoomUseCase {
  constructor(
    private eventQueueService: IEventQueueService,
    private callRoomRepo: ICallRoomRepo,
    private userReadRepo: IUserReadRepo,
    private callReadRepo: ICallReadRepo
  ) {}

  async execute(
    userId: string,
    roomId: string,
    isVideoCall: boolean
  ): Promise<boolean> {
    try {
      const isCallEnded = await this.callReadRepo.findCallEnded(roomId);
      if (isCallEnded) {
        this.eventQueueService.emitWithQueue({
          userId,
          event: 'web-call-already-ended',
          data: { roomId },
          isDirect: true,
        });
        return true;
      }

      const userDetails = await this.userReadRepo.getUsersMinimalDetails([
        userId,
      ]);
      const name = userDetails[0].name;
      const avatar = userDetails[0].avatar;

      await this.callRoomRepo.addUserToRoom(roomId, userId);

      await this.callRoomRepo.saveUser(userId, name, avatar, isVideoCall);

      const memberIds = await this.callRoomRepo.getRoomMembers(roomId);

      const users = await Promise.all(
        memberIds.map(async (id) => ({
          userId: id,
          info: await this.callRoomRepo.getUser(id),
        }))
      );

      this.eventQueueService.emitWithQueue({
        userId,
        event: 'web-user-join',
        data: users,
        isDirect: true,
      });

      return true;
    } catch (err) {
      console.log('Error in WebJoinRoomUseCase: ', err);
      return false;
    }
  }
}
