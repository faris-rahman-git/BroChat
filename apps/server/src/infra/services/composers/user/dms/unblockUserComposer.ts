import { IController } from '../../../../../app/providers/controller/IController';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';
import { IUserWriteRepo } from '../../../../../app/repositories/user/IUserWriteRepo';
import { UnblockUserUseCase } from '../../../../../app/useCases/user/dms/implementations/UnblockUserUseCase';
import { IUnblockUserUseCase } from '../../../../../app/useCases/user/dms/interfaces/IUnblockUserUseCase';
import { unblockUserController } from '../../../../../presentation/http/controller/user/dms/unblockUserController';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';

export function unblockUserComposer(): IController {
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
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

  const useCase: IUnblockUserUseCase = new UnblockUserUseCase(
    userWriteRepo,
    receiverService,
    eventQueueService
  );

  const controller: IController = new unblockUserController(useCase);
  return controller;
}
