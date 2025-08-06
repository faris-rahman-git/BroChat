import { IController } from '../../../../../app/providers/controller/IController';
import { SortGroupListService } from '../../../../providers/user/SortGroupListService';
import { ISortGroupListService } from '../../../../../app/providers/user/ISortGroupListService';
import { CreateNewGroupUseCase } from '../../../../../app/useCases/user/group/implementations/CreateNewGroupUseCase';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { IConversationWriteRepo } from '../../../../../app/repositories/conversation/IConversationWriteRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { ICreateNewGroupUseCase } from '../../../../../app/useCases/user/group/interfaces/ICreateNewGroupUseCase';
import { createNewGroupController } from '../../../../../presentation/http/controller/user/group/createNewGroupController';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';

export function createNewGroupComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const conWriteRepo: IConversationWriteRepo = new ConversationWriteRepo();
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
  const sortGroupListService: ISortGroupListService =
    new SortGroupListService();
  const useCase: ICreateNewGroupUseCase = new CreateNewGroupUseCase(
    userReadRepo,
    conWriteRepo,
    eventQueueService,
    sortGroupListService
  );

  const controller: IController = new createNewGroupController(useCase);
  return controller;
}
