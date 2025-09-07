import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { IMessageWriteRepo } from '../../../repositories/message/IMessageWriteRepo';
import { IStatusUpdateUseCase } from '../interfaces/IStatusUpdateUseCase';
import { statusUpdateType } from '../../../dtos/socketTypes';

export class StatusUpdateUseCase implements IStatusUpdateUseCase {
  constructor(
    private mesWriteRepo: IMessageWriteRepo,
    private eventQueueService: IEventQueueService,
  ) {}

  async execute(data: statusUpdateType, userId: string): Promise<boolean> {
    try {
      const newStatus = await this.mesWriteRepo.updateMessageStatus(
        data.messageId,
        userId,
        data.status
      );

      if (newStatus) {
        void this.eventQueueService.emitWithQueue({
          userId: data.senderId,
          event: 'message-status-update',
          data: {
            messageId: data.messageId,
            status: data.status,
          },
          isDirect: true,
        });
      }

      return true;
    } catch (err) {
      console.log('Error in StatusUpdateUseCase: ', err.message);
      return false;
    }
  }
}
