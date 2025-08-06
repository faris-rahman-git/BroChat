import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { IUserManagementRepo } from '../../../repositories/redis/IUserManagementRepo';
import { IDisconnectUseCase } from '../interfaces/IDisconnectUseCase';

export class DisconnectUseCase implements IDisconnectUseCase {
  constructor(
    private userManagementRepo: IUserManagementRepo,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(socketId: string): Promise<boolean> {
    try {
      const userId = await this.userManagementRepo.removeUserBySocketId(
        socketId
      );
      console.log(`Socket disconnected: ${socketId} (user: ${userId})`);

      if (userId) {
        await this.eventQueueService.notifyPresence(userId, false);
      }

      return true;
    } catch (err: any) {
      console.log('Error in DisconnectUseCase: ', err.message);
      return false;
    }
  }
}
