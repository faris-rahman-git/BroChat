import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { UserMessages } from '../../../../../domain/enums/user/UserMessages';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IMessageDeleteRepo } from '../../../../repositories/message/IMessageDeleteRepo';
import { IMessageReadRepo } from '../../../../repositories/message/IMessageReadRepo';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IDeleteMessageUseCase } from '../interfaces/IDeleteMessageUseCase';
import { DeleteMessageType } from '@bro/shared';

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(
    private mesDeleteRepo: IMessageDeleteRepo,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService,
    private MesReadRepo: IMessageReadRepo,
    private userReadRepo: IUserReadRepo,
    private getMinutesSince: (dateStr: string | Date) => number
  ) {}

  async execute(
    messageId: string,
    conversationId: string,
    userId: string,
    type: DeleteMessageType
  ): Promise<ResponseDTO> {
    try {
      if (type === 'me') {
        await this.mesDeleteRepo.deleteMessageForUser(messageId, userId);
      } else {
        const createdAt = await this.MesReadRepo.findMessageCreatedAt(
          messageId
        );
        const isSubscribed = await this.userReadRepo.findIsSubscribed(
          userId
        );

        const canDeleteForEveryone =
          isSubscribed || this.getMinutesSince(createdAt) <= 60;
        if (!canDeleteForEveryone) {
          return {
            success: false,
            data: { message: UserMessages.No_Permission },
          };
        }

        await this.mesDeleteRepo.deleteMessage(messageId);
        const receiversId = await this.receiverService.getReceiverIds(
          conversationId,
          userId
        );

        await Promise.all(
          receiversId.map((receiverId) =>
            this.eventQueueService.emitWithQueue({
              userId: receiverId,
              event: 'delete-message',
              data: { conversationId, messageId },
              isDirect: true,
            })
          )
        );
      }

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in DeleteMessageUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
