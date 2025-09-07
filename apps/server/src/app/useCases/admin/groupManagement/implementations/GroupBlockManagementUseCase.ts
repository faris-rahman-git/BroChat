import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IConversationWriteRepo } from '../../../../repositories/conversation/IConversationWriteRepo';
import { IGroupBlockManagementUseCase } from '../interfaces/IGroupBlockManagementUseCase';
import { BlockGroupParams } from '@bro/shared';

export class GroupBlockManagementUseCase
  implements IGroupBlockManagementUseCase
{
  constructor(
    private conWriteRepo: IConversationWriteRepo,
    private conReadRepo: IConversationReadRepo,
    private queryService: IQueryService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(data: BlockGroupParams): Promise<ResponseDTO> {
    try {
      await this.conWriteRepo.updateBlockStatus(
        data.conversationId,
        data.isBlocked
      );

      const membersId = await this.conReadRepo.findReceiverId(
        data.conversationId
      );

      await Promise.all(
        membersId.map((id) =>
          this.eventQueueService.emitWithQueue({
            userId: id,
            event: 'group-block-update',
            data: {
              conversationId: data.conversationId,
              isBlocked: data.isBlocked,
            },
            isDirect: true,
          })
        )
      );

      const searchQuery = this.queryService.searchQueryForGroups({
        searchValue: data.searchValue?.trim() ?? '',
        status: data.status,
        createdAt: data.createdAt,
      });

      const updatedGroupList = await this.conReadRepo.findAllGroupsWithSearch(
        searchQuery,
        data.page
      );

      return {
        success: true,
        data: {
          updatedGroupList: updatedGroupList.data,
          totalPages: updatedGroupList.totalPages,
        },
      };
    } catch (err) {
      console.log('Error in GroupBlockManagementUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
