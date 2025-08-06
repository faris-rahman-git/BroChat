import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IExitFromGroupUseCase } from '../interfaces/IExitFromGroupUseCase';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { ConversationDeleteRepo } from '../../../../../infra/repositories/conversationRepo/ConversationDeleteRepo';

export class ExitFromGroupUseCase implements IExitFromGroupUseCase {
  constructor(
    private conWriteRepo: IConversationWriteRepo,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService,
    private conReadRepo: IConversationReadRepo,
    private ConDeleteRepo: ConversationDeleteRepo
  ) {}

  async execute(conversationId: string, userId: string): Promise<ResponseDTO> {
    try {
      let randomNewAdmin: string = '';
      const adminIds = await this.conReadRepo.findGroupAdminIds(conversationId);
      const isAdmin = adminIds.includes(userId);

      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );

      await this.conWriteRepo.removeGroupMember(conversationId, userId);
      if (isAdmin && adminIds.length <= 1 && receiversId.length > 0) {
        randomNewAdmin = receiversId[0];
        await this.conWriteRepo.makeGroupAdmin(conversationId, randomNewAdmin);

        await Promise.all(
          receiversId.map((receiverId) =>
            this.eventQueueService.emitWithQueue({
              userId: receiverId,
              event: 'make-group-admin',
              data: { conversationId, memberId: randomNewAdmin },
              isDirect: true,
            })
          )
        );
      }
      if (receiversId.length <= 0) {
        await this.ConDeleteRepo.softDeleteAConversation(conversationId);
      } else {
        await Promise.all(
          receiversId.map((receiverId) =>
            this.eventQueueService.emitWithQueue({
              userId: receiverId,
              event: 'remove-group-member',
              data: { conversationId, memberId: userId },
              isDirect: true,
            })
          )
        );
      }

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in ExitFromGroupUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
