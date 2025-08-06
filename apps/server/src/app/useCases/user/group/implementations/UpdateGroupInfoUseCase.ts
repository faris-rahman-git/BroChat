import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { UserMessages } from '../../../../../domain/enums/user/UserMessages';
import { ICheckAuthorityService } from '../../../../providers/user/ICheckAuthorityService';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IUpdateGroupInfoUseCase } from '../interfaces/IUpdateGroupInfoUseCase';
import { updateGroupInfoType } from '@bro/shared';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';

export class UpdateGroupInfoUseCase implements IUpdateGroupInfoUseCase {
  constructor(
    private conWriteRepo: IConversationWriteRepo,
    private checkAdminService: ICheckAuthorityService,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    groupInfo: updateGroupInfoType
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

      await this.conWriteRepo.updateGroupInfo(conversationId, groupInfo);

      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );

      await Promise.all(
        receiversId.map((receiverId) =>
          this.eventQueueService.emitWithQueue({
            userId: receiverId,
            event: 'update-group-info',
            data: { conversationId, groupInfo },
            isDirect: true,
          })
        )
      );

      return {
        success: true,
        data: { groupInfo },
      };
    } catch (err: any) {
      console.log('Error in UpdateGroupInfoUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
