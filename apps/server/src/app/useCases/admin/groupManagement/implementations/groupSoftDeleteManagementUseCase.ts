import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IConversationDeleteRepo } from '../../../../repositories/conversation/IConversationDeleteRepo';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IGroupSoftDeleteManagementUseCase } from '../interfaces/IGroupSoftDeleteManagementUseCase';
import { DeleteGroupParams } from '@bro/shared';

export class groupSoftDeleteManagementUseCase
  implements IGroupSoftDeleteManagementUseCase
{
  constructor(
    private conDeleteRepo: IConversationDeleteRepo,
    private conReadRepo: IConversationReadRepo,
    private queryService: IQueryService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(data: DeleteGroupParams): Promise<ResponseDTO> {
    try {
      await this.conDeleteRepo.updateSoftDeleteStatus(
        data.conversationId,
        data.isDeleted
      );

      let updatedGroupList;

      if (data.isDeleted) {
        const membersId = await this.conReadRepo.findReceiverId(
          data.conversationId
        );

        await Promise.all(
          membersId.map((id) =>
            this.eventQueueService.emitWithQueue({
              userId: id,
              event: 'group-soft-delete',
              data: { conversationId: data.conversationId },
              isDirect: true,
            })
          )
        );

        const searchQuery = this.queryService.searchQueryForGroups({
          searchValue: data.searchValue?.trim() ?? '',
          status: data.status,
          createdAt: data.createdAt,
        });

        updatedGroupList = await this.conReadRepo.findAllGroupsWithSearch(
          searchQuery,
          data.page
        );
      } else {
        updatedGroupList = await this.conReadRepo.findDeletedGroups(
          data.searchValue ?? '',
          data.page
        );
      }

      return {
        success: true,
        data: {
          updatedGroupList: updatedGroupList.data,
          totalPages: updatedGroupList.totalPages,
        },
      };
    } catch (err) {
      console.log('Error in groupSoftDeleteManagementUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
