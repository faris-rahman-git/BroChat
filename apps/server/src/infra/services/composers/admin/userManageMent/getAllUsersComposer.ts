import { IController } from '../../../../../app/providers/controller/IController';
import { GetAllUsersUseCase } from '../../../../../app/useCases/admin/userManageMent/implementations/GetAllUsersUseCase';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { IGetAllUsersUseCase } from '../../../../../app/useCases/admin/userManageMent/interfaces/IGetAllUsersUseCase';
import { getAllUsersController } from '../../../../../presentation/http/controller/admin/userManagement/getAllUsersController';

export function getAllUsersComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const queryService: IQueryService = new QueryService();
  const useCase: IGetAllUsersUseCase = new GetAllUsersUseCase(
    userReadRepo,
    queryService
  );

  const controller: IController = new getAllUsersController(useCase);
  return controller;
}
