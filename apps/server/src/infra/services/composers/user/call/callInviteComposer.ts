import { IController } from '../../../../../app/providers/controller/IController';
import { callInviteController } from '../../../../../presentation/http/controller/user/call/callInviteController';
import { ICallInviteUseCase } from '../../../../../app/useCases/user/call/interfaces/ICallInviteUseCase';
import { CallInviteUseCase } from '../../../../../app/useCases/user/call/implementations/CallInviteUseCase';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { CallWriteRepo } from '../../../../repositories/callRepo/CallWriteRepo';

export function callInviteComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    new UserReadRepo()
  );
  const useCase: ICallInviteUseCase = new CallInviteUseCase(
    receiverService,
    eventQueueService,
    new CallWriteRepo(),
    conReadRepo, 
  );
  const controller: IController = new callInviteController(useCase);
  return controller;
}
