import { IController } from '../../../../../app/providers/controller/IController';
import { CallWriteRepo } from '../../../../repositories/callRepo/CallWriteRepo';
import { callEndController } from '../../../../../presentation/http/controller/user/call/callEndController';
import { ICallEndUseCase } from '../../../../../app/useCases/user/call/interfaces/ICallEndUseCase';
import { CallEndUseCase } from '../../../../../app/useCases/user/call/implementations/CallEndUseCase';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { CallReadRepo } from '../../../../repositories/callRepo/CallReadRepo';

export function callEndComposer(): IController {
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    new ConversationReadRepo(),
    new UserReadRepo()
  );
  const useCase: ICallEndUseCase = new CallEndUseCase(
    new CallWriteRepo(),
    eventQueueService,
    new CallReadRepo()
  );
  const controller: IController = new callEndController(useCase);
  return controller;
}
