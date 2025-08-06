import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { UserMessages } from '../../../../../domain/enums/user/UserMessages';
import { ICheckAuthorityService } from '../../../../providers/user/ICheckAuthorityService';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IRemoveGroupMemberUseCase } from '../interfaces/IRemoveGroupMemberUseCase';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';

export class RemoveGroupMemberUseCase implements IRemoveGroupMemberUseCase {
  constructor(
    private conWriteRepo: IConversationWriteRepo,
    private checkAdminService: ICheckAuthorityService,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    memberId: string
  ): Promise<ResponseDTO> {
    try {
      const isAuth = await this.checkAdminService.checkIsAdmin(
        conversationId,
        userId
      );

      if (!isAuth) {
        return {
          success: false,
          data: { message: UserMessages.Not_Admin },
          statusCode: 403,
        };
      }

      await this.conWriteRepo.removeGroupMember(conversationId, memberId);

      await this.eventQueueService.emitWithQueue({
        userId: memberId,
        event: 'remove-group-chat',
        data: { conversationId },
        isDirect: true,
      });

      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        memberId
      );

      await Promise.all(
        receiversId
          .filter((receiverId) => receiverId !== userId)
          .map((receiverId) =>
            this.eventQueueService.emitWithQueue({
              userId: receiverId,
              event: 'remove-group-member',
              data: { conversationId, memberId },
              isDirect: true,
            })
          )
      );

      return {
        success: true,
        data: { memberId },
      };
    } catch (err: any) {
      console.log('Error in RemoveGroupMemberUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
