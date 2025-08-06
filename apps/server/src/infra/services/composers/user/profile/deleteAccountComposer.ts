import { IController } from '../../../../../app/providers/controller/IController';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';
import { deleteAccountController } from '../../../../../presentation/http/controller/user/profile/deleteAccountController';
import { IDeleteAccountUseCase } from '../../../../../app/useCases/user/profile/interfaces/IDeleteAccountUseCase';
import { DeleteAccountUseCase } from '../../../../../app/useCases/user/profile/implementations/DeleteAccountUseCase';

export function deleteAccountComposer(): IController {
  const useCase: IDeleteAccountUseCase = new DeleteAccountUseCase(
    new UserWriteRepo()
  );
  const controller: IController = new deleteAccountController(useCase);
  return controller;
}
