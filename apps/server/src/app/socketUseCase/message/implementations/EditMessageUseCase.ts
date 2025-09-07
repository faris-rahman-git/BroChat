import { iReceiverService } from '../../../providers/common/iReceiverService';
import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { IMessageReadRepo } from '../../../repositories/message/IMessageReadRepo';
import { IMessageWriteRepo } from '../../../repositories/message/IMessageWriteRepo';
import { IUserReadRepo } from '../../../repositories/user/IUserReadRepo';
import { IEditMessageUseCase } from '../interfaces/IEditMessageUseCase';
import { EditMessageType } from '@bro/shared';

export class EditMessageUseCase implements IEditMessageUseCase {
  constructor(
    private mesWriteRepo: IMessageWriteRepo,
    private eventQueueService: IEventQueueService,
    private receiverService: iReceiverService,
    private MesReadRepo: IMessageReadRepo,
    private userReadRepo: IUserReadRepo,
    private getMinutesSince: (dateStr: string | Date) => number
  ) {}

  async execute(data: EditMessageType, userId: string): Promise<boolean> {
    try {
      const createdAt = await this.MesReadRepo.findMessageCreatedAt(
        data.messageId
      );
      const isSubscribed = await this.userReadRepo.findIsSubscribed(
        userId
      );

      const canEdit = isSubscribed || this.getMinutesSince(createdAt) <= 5;

      if (!canEdit) {
        return false;
      }

      await this.mesWriteRepo.editMessage(data.messageId, data.message, userId);

      const receiversId = await this.receiverService.getReceiverIds(
        data.conversationId,
        userId
      );

      // Emit the message to the receiver
      receiversId.forEach(async (receiverId) => {
        void this.eventQueueService.emitWithQueue({
          userId: receiverId,
          event: 'edit-message-update',
          data: data,
          isDirect: true,
        });
      });
      return true;
    } catch (err) {
      console.log('Error in EditMessageUseCase: ', err);
      return false;
    }
  }
}
