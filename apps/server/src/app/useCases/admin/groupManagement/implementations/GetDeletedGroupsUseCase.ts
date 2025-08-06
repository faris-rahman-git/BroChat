import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { GetDeletedGroupsParams } from '@bro/shared';
import { IGetDeletedGroupsUseCase } from '../interfaces/IGetDeletedGroupsUseCase';

export class GetDeletedGroupsUseCase implements IGetDeletedGroupsUseCase {
  constructor(private conReadRepo: IConversationReadRepo) {}

  async execute(data: GetDeletedGroupsParams): Promise<ResponseDTO> {
    try {
      const groupList = await this.conReadRepo.findDeletedGroups(
        data.searchValue,
        data.page
      );

      return {
        success: true,
        data: { groupList: groupList.data, totalPages: groupList.totalPages },
      };
    } catch (err: any) {
      console.log('Error in GetDeletedGroupsUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
