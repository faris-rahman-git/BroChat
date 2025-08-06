import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { IUserManagementRepo } from '../../../repositories/redis/IUserManagementRepo';
import { IUserConnectedUseCase } from '../interfaces/IUserConnectedUseCase';

export class UserConnectedUseCase implements IUserConnectedUseCase {
  constructor(
    private userManagementRepo: IUserManagementRepo,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(socketId: string, userId: string): Promise<boolean> {
    try {
      console.log('User connected:', userId);
      await this.userManagementRepo.saveUserToRedis(socketId, userId);

      await this.eventQueueService.sendPending(userId);

      await this.eventQueueService.notifyPresence(userId, true);

      return true;
    } catch (err: any) {
      console.log('Error in UserConnectedUseCase: ', err.message);
      return false;
    }
  }
}
