import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { AuthMessages } from '../../../../../domain/enums/auth/AuthMessages';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { IUserBlockManagementUseCase } from '../interfaces/IUserBlockManagementUseCase';

export class UserBlockManagementUseCase implements IUserBlockManagementUseCase {
  constructor(
    private userWriteRepo: IUserWriteRepo,
    private userReadRepo: IUserReadRepo,
    private queryService: IQueryService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(
    userId: string,
    isBlocked: boolean,
    searchValue: string,
    status: string,
    joinedAt: string,
    page: number
  ): Promise<ResponseDTO> {
    try {
      await this.userWriteRepo.updateBlockStatus(userId, isBlocked);

      if (isBlocked) {
        await this.eventQueueService.emitWithQueue({
          userId,
          event: 'force-logout',
          data: AuthMessages.YourAccountWasBanned,
          isDirect: true,
        });
      }

      const searchQuery = this.queryService.searchQuery(
        searchValue,
        status,
        joinedAt
      );
      const updatedUsersList = await this.userReadRepo.findAllUsersWithSearch(
        searchQuery,
        page
      );

      return {
        success: true,
        data: {
          updatedUsersList: updatedUsersList.data,
          totalPages: updatedUsersList.totalPages,
        },
      };
    } catch (err: any) {
      console.log('Error in UserBlockManagementUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
