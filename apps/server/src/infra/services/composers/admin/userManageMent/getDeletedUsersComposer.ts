import { IController } from '../../../../../app/providers/controller/IController';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { GetDeletedUsersUseCase } from '../../../../../app/useCases/admin/userManageMent/implementations/GetDeletedUsersUseCase';
import { getDeletedUsersController } from '../../../../../presentation/http/controller/admin/userManagement/getDeletedUsersController';
import { IGetDeletedUsersUseCase } from '../../../../../app/useCases/admin/userManageMent/interfaces/IGetDeletedUsersUseCase';

export function getDeletedUsersComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const useCase: IGetDeletedUsersUseCase = new GetDeletedUsersUseCase(
    userReadRepo
  );

  const controller: IController = new getDeletedUsersController(useCase);
  return controller;
}
