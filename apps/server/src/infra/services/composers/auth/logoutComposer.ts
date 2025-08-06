import { IController } from '../../../../app/providers/controller/IController';
import { LogoutUseCase } from '../../../../app/useCases/auth/implementations/LogoutUseCase';
import { ILogoutUseCase } from '../../../../app/useCases/auth/interfaces/ILogoutUseCase';
import { logoutController } from '../../../../presentation/http/controller/auth/logoutController';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { IUserManagementRepo } from '../../../../app/repositories/redis/IUserManagementRepo';
import { IOfflineQueueRepo } from '../../../../app/repositories/redis/IOfflineQueueRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../app/repositories/redis/ITypingQueueRepo';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { IConversationReadRepo } from '../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';

export function logoutComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );

  const useCase: ILogoutUseCase = new LogoutUseCase(eventQueueService);
  const controller: IController = new logoutController(useCase);
  return controller;
}
