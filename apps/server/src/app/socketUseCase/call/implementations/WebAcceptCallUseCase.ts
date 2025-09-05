import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { IWebAcceptCallUseCase } from '../interfaces/IWebAcceptCallUseCase';

export class WebAcceptCallUseCase implements IWebAcceptCallUseCase {
  constructor(
    private eventQueueService: IEventQueueService,
  ) {}

  async execute(signal: any, to: string, answerId: string): Promise<boolean> {
    try {

      await this.eventQueueService.emitWithoutQueue({
        userId: to,
        event: 'web-call-accepted',
        data: { signal, answerId },
      });

      return true;
    } catch (err: any) {
      console.log('Error in WebAcceptCallUseCase: ', err.message);
      return false;
    }
  }
}
