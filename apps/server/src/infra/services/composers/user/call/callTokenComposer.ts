import { IController } from '../../../../../app/providers/controller/IController';
import { callTokenController } from '../../../../../presentation/http/controller/user/call/callTokenController';
import { ICallTokenUseCase } from '../../../../../app/useCases/user/call/interfaces/ICallTokenUseCase';
import { CallTokenUseCase } from '../../../../../app/useCases/user/call/implementations/CallTokenUseCase';
import { ZegoServerService } from '../../../../providers/user/ZegoServerService';

export function callTokenComposer(): IController {
  const useCase: ICallTokenUseCase = new CallTokenUseCase(
    new ZegoServerService()
  );
  const controller: IController = new callTokenController(useCase);
  return controller;
}
