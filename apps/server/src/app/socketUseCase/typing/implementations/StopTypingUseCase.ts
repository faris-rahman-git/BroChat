import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { TypingType } from '../../../dtos/socketTypes';
import { ITypingQueueRepo } from '../../../repositories/redis/ITypingQueueRepo';
import { IStopTypingUseCase } from '../interfaces/IStopTypingUseCase';

export class StopTypingUseCase implements IStopTypingUseCase {
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
        await this.typingQueueRepo.removeStartTypingFromQueue(
          userId,
          data.receiverId
        );
      }

      void this.eventQueueService.emitWithQueue({
        userId: data.receiverId,
        event: 'typing-status',
        data: {
          senderId: userId,
          status: false,
        },
        isDirect: true,
      });

      return true;
    } catch (err: any) {
      console.log('Error in StopTypingUseCase: ', err.message);
      return false;
    }
  }
}
