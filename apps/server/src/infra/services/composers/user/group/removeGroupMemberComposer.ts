import { IController } from '../../../../../app/providers/controller/IController';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { IConversationWriteRepo } from '../../../../../app/repositories/conversation/IConversationWriteRepo';
import { ICheckAuthorityService } from '../../../../../app/providers/user/ICheckAuthorityService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { RemoveGroupMemberUseCase } from '../../../../../app/useCases/user/group/implementations/RemoveGroupMemberUseCase';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { IRemoveGroupMemberUseCase } from '../../../../../app/useCases/user/group/interfaces/IRemoveGroupMemberUseCase';
import { removeGroupMemberController } from '../../../../../presentation/http/controller/user/group/removeGroupMemberController';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { CheckAuthorityService } from '../../../../providers/user/CheckAuthorityService';

export function removeGroupMemberComposer(): IController {
  const conWriteRepo: IConversationWriteRepo = new ConversationWriteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const checkAdminService: ICheckAuthorityService = new CheckAuthorityService(
    conReadRepo
  );
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
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const useCase: IRemoveGroupMemberUseCase = new RemoveGroupMemberUseCase(
    conWriteRepo,
    checkAdminService,
    receiverService,
    eventQueueService
  );

  const controller: IController = new removeGroupMemberController(useCase);
  return controller;
}
