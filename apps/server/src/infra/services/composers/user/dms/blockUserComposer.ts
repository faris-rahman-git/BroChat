import { IController } from '../../../../../app/providers/controller/IController';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { BlockUserUseCase } from '../../../../../app/useCases/user/dms/implementations/BlockUserUseCase';
import { IBlockUserUseCase } from '../../../../../app/useCases/user/dms/interfaces/IBlockUserUseCase';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';
import { IUserWriteRepo } from '../../../../../app/repositories/user/IUserWriteRepo';
import { blockUserController } from '../../../../../presentation/http/controller/user/dms/blockUserController';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';

export function blockUserComposer(): IController {
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
  const useCase: IBlockUserUseCase = new BlockUserUseCase(
    userWriteRepo,
    receiverService,
    eventQueueService
  );

  const controller: IController = new blockUserController(useCase);
  return controller;
}
