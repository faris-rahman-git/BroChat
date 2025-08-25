import { IController } from '../../../../../app/providers/controller/IController';
import { CallReadRepo } from '../../../../repositories/callRepo/CallReadRepo';
import { callListController } from '../../../../../presentation/http/controller/user/call/callListController';
import { ICallListUseCase } from '../../../../../app/useCases/user/call/interfaces/ICallListUseCase';
import { CallListUseCase } from '../../../../../app/useCases/user/call/implementations/CallListUseCase';

export function callListComposer(): IController {
  const useCase: ICallListUseCase = new CallListUseCase(
    new CallReadRepo()
  );
  const controller: IController = new callListController(useCase);
  return controller;
}
