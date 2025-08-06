import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { AuthMessages } from '../../../../../domain/enums/auth/AuthMessages';
import { IDeleteService } from '../../../../providers/auth/IDeleteService';
import { IEventQueueService } from '../../../../providers/socket/IEventQueueService';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IHardDeleteUserUseCase } from '../interfaces/IHardDeleteUserUseCase';

export class HardDeleteUserUseCase implements IHardDeleteUserUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private eventQueueService: IEventQueueService,
    private deleteService: IDeleteService
  ) {}

  async execute(
    userId: string,
    searchValue: string,
    page: number
  ): Promise<ResponseDTO> {
    try {
      await this.deleteService.deleteUserFromAllModels(userId);

      await this.eventQueueService.emitWithQueue({
        userId,
        event: 'force-logout',
        data: AuthMessages.YourAccountWasDeleted,
        isDirect: true,
      });

      const updatedUsersList = await this.userReadRepo.findDeletedUsers(
        searchValue,
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
      console.log('Error in HardDeleteUserUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
