import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IGetDeletedUsersUseCase } from '../interfaces/IGetDeletedUsersUseCase';

export class GetDeletedUsersUseCase implements IGetDeletedUsersUseCase {
  constructor(private userReadRepo: IUserReadRepo) {}

  async execute(searchValue: string, page: number): Promise<ResponseDTO> {
    try {
      const usersList = await this.userReadRepo.findDeletedUsers(
        searchValue,
        page
      );

      return {
        success: true,
        data: { usersList: usersList.data, totalPages: usersList.totalPages },
      };
    } catch (err) {
      console.log('Error in GetDeletedUsersUseCase: ', err);
      return {
        success: false,
        data: { message: (err as Error).message },
      };
    }
  }
}
