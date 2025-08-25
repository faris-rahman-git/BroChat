import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IMessageWriteRepo } from '../../../../repositories/message/IMessageWriteRepo';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IAddReactionUseCase } from '../interfaces/IAddReactionUseCase';

export class AddReactionUseCase implements IAddReactionUseCase {
  constructor(
    private mesWriteRepo: IMessageWriteRepo,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService,
    private userReadRepo: IUserReadRepo
  ) {}

  async execute(
    userId: string,
    messageId: string,
    emoji: string,
    conversationId: string
  ): Promise<ResponseDTO> {
    try {
      await this.mesWriteRepo.addOrUpdateReaction(messageId, emoji, userId);
      const userDetails = await this.userReadRepo.getUsersMinimalDetails([
        userId,
      ]);

      const payload = {
        userId,
        name: userDetails[0].name,
        avatar: userDetails[0].avatar,
        emoji,
      };

      //emit to other users
      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );

      await Promise.all(
        receiversId.map((receiverId) =>
          this.eventQueueService.emitWithQueue({
            userId: receiverId,
            event: 'add-reaction',
            data: { payload, conversationId, messageId },
            isDirect: true,
          })
        )
      );

      return {
        success: true,
        data: {
          ...payload,
        },
      };
    } catch (err: any) {
      console.log('Error in AddReactionUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
