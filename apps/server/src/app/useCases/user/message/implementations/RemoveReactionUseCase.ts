import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IMessageDeleteRepo } from '../../../../repositories/message/IMessageDeleteRepo';
import { IRemoveReactionUseCase } from '../interfaces/IRemoveReactionUseCase';

export class RemoveReactionUseCase implements IRemoveReactionUseCase {
  constructor(
    private mesDeleteRepo: IMessageDeleteRepo,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(
    userId: string,
    messageId: string,
    conversationId: string,
  ): Promise<ResponseDTO> {
    try {
      await this.mesDeleteRepo.removeReaction(messageId, userId);

      //emit to other users
      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );

      await Promise.all(
        receiversId.map((receiverId) =>
          this.eventQueueService.emitWithQueue({
            userId: receiverId,
            event: 'remove-reaction',
            data: { userId, conversationId, messageId },
            isDirect: true,
          })
        )
      );

      return {
        success: true,
        data: {
          userId,
          conversationId,
          messageId,
        },
      };
    } catch (err) {
      console.log('Error in RemoveReactionUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
