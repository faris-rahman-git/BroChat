import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { UserMessages } from '../../../../../domain/enums/user/UserMessages';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IDismissGroupAdminUseCase } from '../interfaces/IDismissGroupAdminUseCase';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { ICheckAuthorityService } from '../../../../providers/user/ICheckAuthorityService';

export class DismissGroupAdminUseCase implements IDismissGroupAdminUseCase {
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

      await this.conWriteRepo.dismissGroupAdmin(conversationId, memberId);

      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );

      await Promise.all(
        receiversId.map((receiverId) =>
          this.eventQueueService.emitWithQueue({
            userId: receiverId,
            event: 'dismiss-group-admin',
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
      console.log('Error in DismissGroupAdminUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
