import { IController } from '../../../../../app/providers/controller/IController';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IGroupSoftDeleteManagementUseCase } from '../../../../../app/useCases/admin/groupManagement/interfaces/IGroupSoftDeleteManagementUseCase';
import { groupSoftDeleteManagementController } from '../../../../../presentation/http/controller/admin/groupManagement/groupSoftDeleteManagementController';
import { groupSoftDeleteManagementUseCase } from '../../../../../app/useCases/admin/groupManagement/implementations/groupSoftDeleteManagementUseCase';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IConversationDeleteRepo } from '../../../../../app/repositories/conversation/IConversationDeleteRepo';
import { ConversationDeleteRepo } from '../../../../repositories/conversationRepo/ConversationDeleteRepo';

export function groupSoftDeleteManagementComposer(): IController {
  const conDeleteRepo: IConversationDeleteRepo = new ConversationDeleteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const queryService: IQueryService = new QueryService();
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    new UserReadRepo()
  );
  const useCase: IGroupSoftDeleteManagementUseCase =
    new groupSoftDeleteManagementUseCase(
      conDeleteRepo,
      conReadRepo,
      queryService,
      eventQueueService
    );

  const controller: IController = new groupSoftDeleteManagementController(
    useCase
  );
  return controller;
}
