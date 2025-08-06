import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { ISortGroupListService } from '../../../../providers/user/ISortGroupListService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IGroupChatListUseCase } from '../interfaces/IGroupChatListUseCase';

export class GroupChatListUseCase implements IGroupChatListUseCase {
  constructor(
    private conReadRepo: IConversationReadRepo,
    private sortGroupListService: ISortGroupListService
  ) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      const groupList = await this.conReadRepo.findGroups(userId);

      const sortedGroupList = this.sortGroupListService.sortGroupList(
        groupList,
        userId
      );

      return {
        success: true,
        data: { groupList: sortedGroupList },
      };
    } catch (err: any) {
      console.log('Error in GroupChatListUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
