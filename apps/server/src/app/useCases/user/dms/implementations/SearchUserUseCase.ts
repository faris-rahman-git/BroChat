import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IDmFilterService } from '../../../../providers/user/IDmFilterService';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { ISearchUserUseCase } from '../interfaces/ISearchUserUseCase';

export class SearchUserUseCase implements ISearchUserUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private dmFilterService: IDmFilterService
  ) {}

  async execute(searchData: string, userId: string): Promise<ResponseDTO> {
    try {
      const matchedUsers = await this.userReadRepo.findMatchUsers(
        searchData,
        userId
      );

      const matchedUsersWithConversationId =
        await this.dmFilterService.findUsersWithConversationIdsHelper(
          matchedUsers,
          userId
        );

      return {
        success: true,
        data: { MatchedUsers: matchedUsersWithConversationId },
      };
    } catch (err) {
      console.log('Error in SearchUserUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
