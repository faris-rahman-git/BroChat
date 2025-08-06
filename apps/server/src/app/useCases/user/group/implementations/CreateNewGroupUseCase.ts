import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { CreateGroupInputType } from '../../../../dtos/group';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { ISortGroupListService } from '../../../../providers/user/ISortGroupListService';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { ICreateNewGroupUseCase } from '../interfaces/ICreateNewGroupUseCase';

export class CreateNewGroupUseCase implements ICreateNewGroupUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private conWriteRepo: IConversationWriteRepo,
    private eventQueueService: IEventQueueService,
    private sortGroupListService: ISortGroupListService
  ) {}

  async execute(
    groupDetails: CreateGroupInputType,
    userId: string
  ): Promise<ResponseDTO> {
    try {
      const newConversation = await this.conWriteRepo.createNewGroup(
        userId,
        groupDetails.groupName,
        groupDetails.groupMembers,
        groupDetails.groupAvatarUrl
      );

      const allMemberIds = [userId, ...groupDetails.groupMembers];
      const participants = await this.userReadRepo.getUsersMinimalDetails(
        allMemberIds
      );

      await Promise.all(
        participants.map(async (newMember) => {
          const sortedGroup = this.sortGroupListService.sortNewGroupList(
            {
              _id: newConversation._id,
              participants,
              Admins: [userId],
              avatar: groupDetails.groupAvatarUrl,
              groupName: groupDetails.groupName,
              about: '',
              createdBy: userId,
              createdAt: newConversation.createdAt,
            },
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
      console.log('Error in CreateNewGroupUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
