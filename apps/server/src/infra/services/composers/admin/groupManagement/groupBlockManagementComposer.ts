import { IController } from '../../../../../app/providers/controller/IController';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';
import { IGetAllGroupsUseCase } from '../../../../../app/useCases/admin/groupManagement/interfaces/IGetAllGroupsUseCase';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { groupBlockManagementController } from '../../../../../presentation/http/controller/admin/groupManagement/groupBlockManagementController';
import { GroupBlockManagementUseCase } from '../../../../../app/useCases/admin/groupManagement/implementations/GroupBlockManagementUseCase';
import { IConversationWriteRepo } from '../../../../../app/repositories/conversation/IConversationWriteRepo';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';

export function groupBlockManagementComposer(): IController {
  const conWriteRepo: IConversationWriteRepo = new ConversationWriteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const queryService: IQueryService = new QueryService();
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    new UserReadRepo()
  );
  const useCase: IGetAllGroupsUseCase = new GroupBlockManagementUseCase(
    conWriteRepo,
    conReadRepo,
    queryService,
    eventQueueService
  );

  const controller: IController = new groupBlockManagementController(useCase);
  return controller;
}
