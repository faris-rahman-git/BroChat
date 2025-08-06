import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { IQueryService } from '../../../../providers/admin/IQueryService';
import { IUserReadRepo } from '../../../../repositories/user/IUserReadRepo';
import { IGetAllUsersUseCase } from '../interfaces/IGetAllUsersUseCase';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    private userReadRepo: IUserReadRepo,
    private queryService: IQueryService
  ) {}

  async execute(
    searchValue: string,
    status: string,
    joinedAt: string,
    page: number
  ): Promise<ResponseDTO> {
    try {
      const searchQuery = this.queryService.searchQuery(
        searchValue,
        status,
        joinedAt
      );
      const usersList = await this.userReadRepo.findAllUsersWithSearch(
        searchQuery,
        page
      );
      return {
        success: true,
        data: { usersList: usersList.data, totalPages: usersList.totalPages },
      };
    } catch (err: any) {
      console.log('Error in GetAllUsersUseCase: ', err.message);
      return {
        success: false,
        data: { message: err.message },
      };
    }
  }
}
