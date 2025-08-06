import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IUserWriteRepo } from '../../../../repositories/user/IUserWriteRepo';
import { IRestoreUserUseCase } from '../interfaces/IRestoreUserUseCase';

export class RestoreUserUseCase implements IRestoreUserUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private userWriteRepo: IUserWriteRepo
  ) {}

  async execute(
    userId: string,
    searchValue: string,
    page: number
  ): Promise<ResponseDTO> {
    try {
      await this.userWriteRepo.updateSoftDeleteStatus(userId, false, '');
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
      console.log('Error in RestoreUserUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
