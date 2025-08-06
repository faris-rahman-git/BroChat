import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { IStartTypingUseCase } from '../interfaces/IStartTypingUseCase';
import { TypingType } from '../../../dtos/socketTypes';
import { ITypingQueueRepo } from '../../../repositories/redis/ITypingQueueRepo';

export class StartTypingUseCase implements IStartTypingUseCase {
  constructor(
    private typingQueueRepo: ITypingQueueRepo,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(data: TypingType, userId: string): Promise<boolean> {
    try {
      const exist = await this.typingQueueRepo.checkStartTypingIncludes(
        userId,
        data.receiverId
      );
      if (!exist) {
        await this.typingQueueRepo.addStartTypingToQueue(
          userId,
          data.receiverId
        );
      }

      void this.eventQueueService.emitWithQueue({
        userId: data.receiverId,
        event: 'typing-status',
        data: {
          senderId: userId,
          status: true,
        },
        isDirect: true,
      });

      return true;
    } catch (err: any) {
      console.log('Error in StartTypingUseCase: ', err.message);
      return false;
    }
  }
}
