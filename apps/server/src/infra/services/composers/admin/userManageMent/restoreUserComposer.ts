import { IController } from '../../../../../app/providers/controller/IController';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { IRestoreUserUseCase } from '../../../../../app/useCases/admin/userManageMent/interfaces/IRestoreUserUseCase';
import { RestoreUserUseCase } from '../../../../../app/useCases/admin/userManageMent/implementations/RestoreUserUseCase';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';
import { IUserWriteRepo } from '../../../../../app/repositories/user/IUserWriteRepo';
import { restoreUserController } from '../../../../../presentation/http/controller/admin/userManagement/restoreUserController';

export function restoreUserComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const useCase: IRestoreUserUseCase = new RestoreUserUseCase(
    userReadRepo,
    userWriteRepo
  );

  const controller: IController = new restoreUserController(useCase);
  return controller;
}
