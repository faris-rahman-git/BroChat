import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IConversationReadRepo } from '../../../../repositories/conversation/IConversationReadRepo';
import { hardDeleteGroupParams } from '@bro/shared';
import { IHardDeleteGroupUseCase } from '../interfaces/IHardDeleteGroupUseCase';
import { IConversationDeleteRepo } from '../../../../repositories/conversation/IConversationDeleteRepo';

export class HardDeleteGroupUseCase implements IHardDeleteGroupUseCase {
  constructor(
    private conReadRepo: IConversationReadRepo,
    private conDeleteRepo: IConversationDeleteRepo
  ) {}

  async execute(data: hardDeleteGroupParams): Promise<ResponseDTO> {
    try {
      await this.conDeleteRepo.hardDeleteAConversation(data.conversationId);

      const updatedGroupList = await this.conReadRepo.findDeletedGroups(
        data.searchValue ?? '',
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
      console.log('Error in HardDeleteGroupUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
