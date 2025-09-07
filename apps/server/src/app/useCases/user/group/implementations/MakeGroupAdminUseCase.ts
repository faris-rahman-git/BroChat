import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { UserMessages } from '../../../../../domain/enums/user/UserMessages';
import { ICheckAuthorityService } from '../../../../providers/user/ICheckAuthorityService';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IMakeGroupAdminUseCase } from '../interfaces/IMakeGroupAdminUseCase';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';

export class MakeGroupAdminUseCase implements IMakeGroupAdminUseCase {
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

      await this.conWriteRepo.makeGroupAdmin(conversationId, memberId);

      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );

      await Promise.all(
        receiversId.map((receiverId) =>
          this.eventQueueService.emitWithQueue({
            userId: receiverId,
            event: 'make-group-admin',
            data: { conversationId, memberId },
            isDirect: true,
          })
        )
      );

      return {
        success: true,
        data: { memberId },
      };
    } catch (err) {
      console.log('Error in MakeGroupAdminUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
