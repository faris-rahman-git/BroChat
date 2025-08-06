import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IUserManagementRepo } from '../../../../app/repositories/redis/IUserManagementRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { IOfflineQueueRepo } from '../../../../app/repositories/redis/IOfflineQueueRepo';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { ITypingQueueRepo } from '../../../../app/repositories/redis/ITypingQueueRepo';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../app/repositories/conversation/IConversationReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { MessageWriteRepo } from '../../../repositories/messageRepo/MessageWriteRepo';
import { IMessageWriteRepo } from '../../../../app/repositories/message/IMessageWriteRepo';
import { StatusUpdateUseCase } from '../../../../app/socketUseCase/message/implementations/StatusUpdateUseCase';
import { statusUpdateController } from '../../../../presentation/socket/controllers/message/statusUpdateController';
import { IStatusUpdateUseCase } from '../../../../app/socketUseCase/message/interfaces/IStatusUpdateUseCase';

export function statusUpdateComposer(): ISocketController {
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const mesWriteRepo: IMessageWriteRepo = new MessageWriteRepo();
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );
  const useCase: IStatusUpdateUseCase = new StatusUpdateUseCase(
    mesWriteRepo,
    eventQueueService
  );

  const controller: ISocketController = new statusUpdateController(useCase);
  return controller;
}
