import { IController } from '../../../../../app/providers/controller/IController';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { IUserWriteRepo } from '../../../../../app/repositories/user/IUserWriteRepo';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { SoftDeleteUserUseCase } from '../../../../../app/useCases/admin/userManageMent/implementations/SoftDeleteUserUseCase';
import { softDeleteUserController } from '../../../../../presentation/http/controller/admin/userManagement/softDeleteUserController';
import { ISoftDeleteUserUseCase } from '../../../../../app/useCases/admin/userManageMent/interfaces/ISoftDeleteUserUseCase';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';

export function softDeleteUserComposer(): IController {
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const queryService: IQueryService = new QueryService();
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
  const useCase: ISoftDeleteUserUseCase = new SoftDeleteUserUseCase(
    userWriteRepo,
    userReadRepo,
    queryService,
    eventQueueService
  );

  const controller: IController = new softDeleteUserController(useCase);
  return controller;
}
