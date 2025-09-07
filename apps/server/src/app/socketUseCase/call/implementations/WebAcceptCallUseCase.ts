import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { IWebAcceptCallUseCase } from '../interfaces/IWebAcceptCallUseCase';
import Peer from 'simple-peer';

export class WebAcceptCallUseCase implements IWebAcceptCallUseCase {
  constructor(
    private eventQueueService: IEventQueueService,
  ) {}

  async execute(signal: Peer.SignalData, to: string, answerId: string): Promise<boolean> {
    try {

      await this.eventQueueService.emitWithoutQueue({
        userId: to,
        event: 'web-call-accepted',
        data: { signal, answerId },
      });

      return true;
    } catch (err) {
      console.log('Error in WebAcceptCallUseCase: ', err);
      return false;
    }
  }
}
