import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IGetAllGroupsUseCase } from '../interfaces/IGetAllGroupsUseCase';
import { GetAllGroupParams } from '@bro/shared';

export class GetAllGroupsUseCase implements IGetAllGroupsUseCase {
  constructor(
    private conReadRepo: IConversationReadRepo,
    private queryService: IQueryService
  ) {}

  async execute(data: GetAllGroupParams): Promise<ResponseDTO> {
    try {
      const searchQuery = this.queryService.searchQueryForGroups({
        searchValue: data.searchValue?.trim() ?? '',
        status: data.status,
        createdAt: data.createdAt,
      });

      const groupList = await this.conReadRepo.findAllGroupsWithSearch(
        searchQuery,
        data.page
      );

      return {
        success: true,
        data: { groupList: groupList.data, totalPages: groupList.totalPages },
      };
    } catch (err) {
      console.log('Error in GetAllGroupsUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
