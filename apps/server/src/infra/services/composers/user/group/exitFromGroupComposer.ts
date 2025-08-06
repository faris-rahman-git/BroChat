import { IController } from '../../../../../app/providers/controller/IController';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { IConversationWriteRepo } from '../../../../../app/repositories/conversation/IConversationWriteRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { exitFromGroupController } from '../../../../../presentation/http/controller/user/group/exitFromGroupController';
import { IExitFromGroupUseCase } from '../../../../../app/useCases/user/group/interfaces/IExitFromGroupUseCase';
import { ExitFromGroupUseCase } from '../../../../../app/useCases/user/group/implementations/ExitFromGroupUseCase';
import { ConversationDeleteRepo } from '../../../../repositories/conversationRepo/ConversationDeleteRepo';

export function exitFromGroupComposer(): IController {
  const conWriteRepo: IConversationWriteRepo = new ConversationWriteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const useCase: IExitFromGroupUseCase = new ExitFromGroupUseCase(
    conWriteRepo,
    receiverService,
    eventQueueService,
    conReadRepo,
    new ConversationDeleteRepo()
  );

  const controller: IController = new exitFromGroupController(useCase);
  return controller;
}
