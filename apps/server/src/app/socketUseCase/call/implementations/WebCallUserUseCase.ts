import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { ICallRoomRepo } from '../../../repositories/redis/ICallRoomRepo';
import { IWebCallUserUseCase } from '../interfaces/IWebCallUserUseCase';
import Peer from 'simple-peer';

export class WebCallUserUseCase implements IWebCallUserUseCase {
  constructor(
    private eventQueueService: IEventQueueService,
    private callRoomRepo: ICallRoomRepo
  ) {}

  async execute(
    userToCall: string,
    from: string,
    signal: Peer.SignalData
  ): Promise<boolean> {
    try {

      const fromUser = await this.callRoomRepo.getUser(from);

      void this.eventQueueService.emitWithoutQueue({
        userId: userToCall,
        event: 'web-receive-call',
        data: { signal, from, info: fromUser },
      });
      return true;
    } catch (err) {
      console.log('Error in WebCallUserUseCase: ', err);
      return false;
    }
  }
}
