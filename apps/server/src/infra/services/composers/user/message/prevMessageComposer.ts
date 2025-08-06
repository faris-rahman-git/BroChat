import { IController } from '../../../../../app/providers/controller/IController';
import { IMessageReadRepo } from '../../../../../app/repositories/message/IMessageReadRepo';
import { MessageReadRepo } from '../../../../repositories/messageRepo/MessageReadRepo';
import { PrevMessageUseCase } from '../../../../../app/useCases/user/message/implementations/PrevMessageUseCase';
import { IPrevMessageUseCase } from '../../../../../app/useCases/user/message/interfaces/IPrevMessageUseCase';
import { prevMessageController } from '../../../../../presentation/http/controller/user/message/prevMessageController';

export function prevMessageComposer(): IController {
  const mesReadRepo: IMessageReadRepo = new MessageReadRepo();
  const useCase: IPrevMessageUseCase = new PrevMessageUseCase(mesReadRepo);

  const controller: IController = new prevMessageController(useCase);
  return controller;
}
