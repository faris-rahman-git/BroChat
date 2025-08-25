import { IController } from '../../../../../app/providers/controller/IController';
import { CallWriteRepo } from '../../../../repositories/callRepo/CallWriteRepo';
import { callLeftController } from '../../../../../presentation/http/controller/user/call/callLeftController';
import { ICallLeftUseCase } from '../../../../../app/useCases/user/call/interfaces/ICallLeftUseCase';
import { CallLeftUseCase } from '../../../../../app/useCases/user/call/implementations/CallLeftUseCase';

export function callLeftComposer(): IController {
  const useCase: ICallLeftUseCase = new CallLeftUseCase(new CallWriteRepo());
  const controller: IController = new callLeftController(useCase);
  return controller;
}
