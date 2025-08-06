import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { UserMessages } from '../../../../../domain/enums/user/UserMessages';
import { iReceiverService } from '../../../../providers/common/iReceiverService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IAddGroupMembersUseCase } from '../interfaces/IAddGroupMembersUseCase';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { ISortGroupListService } from '../../../../providers/user/ISortGroupListService';
import { ICheckAuthorityService } from '../../../../providers/user/ICheckAuthorityService';

export class AddGroupMembersUseCase implements IAddGroupMembersUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private conWriteRepo: IConversationWriteRepo,
    private conReadRepo: IConversationReadRepo,
    private checkAdminService: ICheckAuthorityService,
    private receiverService: iReceiverService,
    private eventQueueService: IEventQueueService,
    private sortGroupListService: ISortGroupListService
  ) {}

  async execute(
    conversationId: string,
    userId: string,
    newMembersId: string[]
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

      await this.conWriteRepo.addMoreParticipants(conversationId, newMembersId);

      const receiversId = await this.receiverService.getReceiverIds(
        conversationId,
        userId
      );

      const newMemberDetails = await this.userReadRepo.getUsersMinimalDetails(
        newMembersId
      );

      await Promise.all(
        [...receiversId, userId].map((receiverId) =>
          this.eventQueueService.emitWithQueue({
            userId: receiverId,
            event: 'add-group-members',
            data: { newMemberDetails, conversationId },
            isDirect: true,
          })
        )
      );

      const conversationDetails = await this.conReadRepo.findConversationById(
        conversationId
      );

      await Promise.all(
        newMemberDetails.map(async (newMember) => {
          const sortedGroup = this.sortGroupListService.sortNewGroupList(
            conversationDetails,
            newMember._id
          );

          await this.eventQueueService.emitWithQueue({
            userId: newMember._id,
            event: 'new-group-chat',
            data: sortedGroup,
            isDirect: true,
          });
        })
      );

      return {
        success: true,
      };
    } catch (err: any) {
      console.log('Error in AddGroupMembersUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
