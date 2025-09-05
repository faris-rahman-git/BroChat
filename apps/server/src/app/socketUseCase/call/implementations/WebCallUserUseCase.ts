import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { ICallRoomRepo } from '../../../repositories/redis/ICallRoomRepo';
import { IWebCallUserUseCase } from '../interfaces/IWebCallUserUseCase';

export class WebCallUserUseCase implements IWebCallUserUseCase {
  constructor(
    private eventQueueService: IEventQueueService,
    private callRoomRepo: ICallRoomRepo
  ) {}

  async execute(
    userToCall: string,
    from: string,
    signal: any
  ): Promise<boolean> {
    try {

      const fromUser = await this.callRoomRepo.getUser(from);

      void this.eventQueueService.emitWithoutQueue({
        userId: userToCall,
        event: 'web-receive-call',
        data: { signal, from, info: fromUser },
      });
      return true;
    } catch (err: any) {
      console.log('Error in WebCallUserUseCase: ', err.message);
      return false;
    }
  }
}
