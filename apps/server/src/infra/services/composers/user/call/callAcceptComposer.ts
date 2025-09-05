import { IController } from '../../../../../app/providers/controller/IController';
import { CallWriteRepo } from '../../../../repositories/callRepo/CallWriteRepo';
import { callAcceptController } from '../../../../../presentation/http/controller/user/call/callAcceptController';
import { CallAcceptUseCase } from '../../../../../app/useCases/user/call/implementations/CallAcceptUseCase';
import { ICallAcceptUseCase } from '../../../../../app/useCases/user/call/interfaces/ICallAcceptUseCase';
import { CallReadRepo } from '../../../../repositories/callRepo/CallReadRepo';

export function callAcceptComposer(): IController {
  const useCase: ICallAcceptUseCase = new CallAcceptUseCase(
    new CallWriteRepo(),
    new CallReadRepo()
  );
  const controller: IController = new callAcceptController(useCase);
  return controller;
}
