import { iReceiverService } from '../../../providers/common/iReceiverService';
import { IEventQueueService } from '../../../providers/socket/IEventQueueService';
import { ITempIdCache } from '../../../providers/socket/ITempIdCache';
import { IMessageReadRepo } from '../../../repositories/message/IMessageReadRepo';
import { IMessageWriteRepo } from '../../../repositories/message/IMessageWriteRepo';
import { ISendMessageUseCase } from '../interfaces/ISendMessageUseCase';
import { MessageType } from '@bro/shared';

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private mesReadRepo: IMessageReadRepo,
    private mesWriteRepo: IMessageWriteRepo,
    private eventQueueService: IEventQueueService,
    private receiverService: iReceiverService,
    private tempIdCache: ITempIdCache
  ) {}

  async execute(data: MessageType, userId: string): Promise<boolean> {
    const tempId = data.tempId as string;

    try {
      // 1. Check in-memory cache
      if (this.tempIdCache.isCached(tempId)) {
        return true;
      }
      this.tempIdCache.add(tempId);

      // 2. Optional: check DB (if cache missed)
      const exists = await this.mesReadRepo.findByTempId(tempId);
      if (exists) {
        return true;
      }

      const receiversId = await this.receiverService.getReceiverIds(
        data.conversationId as string,
        data.senderId as string
      );

      const savedMessage = await this.mesWriteRepo.save(data, receiversId);

      // Emit the message sent status to the sender
      void this.eventQueueService.emitWithQueue({
        userId: userId,
        event: 'message-status-sent',
        data: {
          tempId: tempId,
          savedMessage,
        },
        isDirect: true,
      });

      // Emit the message to the receiver
      receiversId.forEach((receiverId: string) => {
        void this.eventQueueService.emitWithQueue({
          userId: receiverId,
          event: 'new-message',
          data: savedMessage,
          isDirect: true,
        });
      });

      return true;
    } catch (err) {
      console.log('Error in SendMessageUseCase: ', err);
      this.tempIdCache.remove(tempId);
      return false;
    }
  }
}
