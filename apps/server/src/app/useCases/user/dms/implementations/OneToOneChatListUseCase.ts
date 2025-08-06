import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IDmFilterService } from '../../../../providers/user/IDmFilterService';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { IOneToOneChatListUseCase } from '../interfaces/IOneToOneChatListUseCase';

export class OneToOneChatListUseCase implements IOneToOneChatListUseCase {
  constructor(
    private conReadRepo: IConversationReadRepo,
    private dmFilterService: IDmFilterService
  ) {}

  async execute(userId: string): Promise<ResponseDTO> {
    try {
      const usersList = await this.conReadRepo.findDMs(userId);

      const userConversations =
        await this.dmFilterService.filterUserConversationsHelper(
          usersList,
          userId
        );

      return {
        success: true,
        data: { usersList: userConversations },
      };
    } catch (err: any) {
      console.log('Error in OneToOneChatListUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
