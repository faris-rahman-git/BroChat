import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IUserManagementRepo } from '../../../../app/repositories/redis/IUserManagementRepo';
import { UserConnectedUseCase } from '../../../../app/socketUseCase/connection/implementations/UserConnectedUseCase';
import { IUserConnectedUseCase } from '../../../../app/socketUseCase/connection/interfaces/IUserConnectedUseCase';
import { userConnectedController } from '../../../../presentation/socket/controllers/connection/userConnectedController';
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

export function userConnectedComposer(): ISocketController {
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );
  const useCase: IUserConnectedUseCase = new UserConnectedUseCase(
    userManagementRepo,
    eventQueueService
  );

  const controller: ISocketController = new userConnectedController(useCase);
  return controller;
}
