import { IController } from '../../../../../app/providers/controller/IController';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { IConversationWriteRepo } from '../../../../../app/repositories/conversation/IConversationWriteRepo';
import { ICheckAuthorityService } from '../../../../../app/providers/user/ICheckAuthorityService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { IAddGroupMembersUseCase } from '../../../../../app/useCases/user/group/interfaces/IAddGroupMembersUseCase';
import { addGroupMembersController } from '../../../../../presentation/http/controller/user/group/addGroupAdminController';
import { AddGroupMembersUseCase } from '../../../../../app/useCases/user/group/implementations/AddGroupMembersUseCase';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { SortGroupListService } from '../../../../providers/user/SortGroupListService';
import { ISortGroupListService } from '../../../../../app/providers/user/ISortGroupListService';
import { CheckAuthorityService } from '../../../../providers/user/CheckAuthorityService';

export function addGroupMembersComposer(): IController {
  const conWriteRepo: IConversationWriteRepo = new ConversationWriteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const checkAdminService: ICheckAuthorityService = new CheckAuthorityService(
    conReadRepo
  );
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
  const sortGroupListService: ISortGroupListService = new SortGroupListService();
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const useCase: IAddGroupMembersUseCase = new AddGroupMembersUseCase(
    userReadRepo,
    conWriteRepo,
    conReadRepo,
    checkAdminService,
    receiverService,
    eventQueueService,
    sortGroupListService
  );

  const controller: IController = new addGroupMembersController(useCase);
  return controller;
}
