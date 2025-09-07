import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { AuthMessages } from '../../../../../domain/enums/auth/AuthMessages';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { ISoftDeleteUserUseCase } from '../interfaces/ISoftDeleteUserUseCase';

export class SoftDeleteUserUseCase implements ISoftDeleteUserUseCase {
  constructor(
    private userWriteRepo: IUserWriteRepo,
    private userReadRepo: IUserReadRepo,
    private queryService: IQueryService,
    private eventQueueService: IEventQueueService
  ) {}

  async execute(
    userId: string,
    searchValue: string,
    status: string,
    joinedAt: string,
    page: number
  ): Promise<ResponseDTO> {
    try {
      await this.userWriteRepo.updateSoftDeleteStatus(userId, true, 'admin');

      await this.eventQueueService.emitWithQueue({
        userId,
        event: 'force-logout',
        data: AuthMessages.YourAccountWasDeleted,
        isDirect: true,
      });

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
    } catch (err) {
      console.log('Error in SoftDeleteUserUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
