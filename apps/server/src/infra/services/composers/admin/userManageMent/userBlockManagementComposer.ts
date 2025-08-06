import { IController } from '../../../../../app/providers/controller/IController';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { UserBlockManagementUseCase } from '../../../../../app/useCases/admin/userManageMent/implementations/UserBlockManagementUseCase';
import { IUserBlockManagementUseCase } from '../../../../../app/useCases/admin/userManageMent/interfaces/IUserBlockManagementUseCase';
import { IUserWriteRepo } from '../../../../../app/repositories/user/IUserWriteRepo';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { userBlockManagementController } from '../../../../../presentation/http/controller/admin/userManagement/userBlockManagementController';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';

export function userBlockManagementComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const queryService: IQueryService = new QueryService();
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
  const useCase: IUserBlockManagementUseCase = new UserBlockManagementUseCase(
    userWriteRepo,
    userReadRepo,
    queryService,
    eventQueueService
  );

  const controller: IController = new userBlockManagementController(useCase);
  return controller;
}
