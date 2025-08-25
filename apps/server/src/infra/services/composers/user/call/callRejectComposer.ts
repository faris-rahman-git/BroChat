import { IController } from '../../../../../app/providers/controller/IController';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { CallWriteRepo } from '../../../../repositories/callRepo/CallWriteRepo';
import { callRejectController } from '../../../../../presentation/http/controller/user/call/callRejectController';
import { ICallRejectUseCase } from '../../../../../app/useCases/user/call/interfaces/ICallRejectUseCase';
import { CallRejectUseCase } from '../../../../../app/useCases/user/call/implementations/CallRejectUseCase';

export function callRejectComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    new UserReadRepo()
  );
  const useCase: ICallRejectUseCase = new CallRejectUseCase(
    eventQueueService,
    new CallWriteRepo()
  );
  const controller: IController = new callRejectController(useCase);
  return controller;
}
