import { IController } from '../../../../../app/providers/controller/IController';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { IConversationWriteRepo } from '../../../../../app/repositories/conversation/IConversationWriteRepo';
import { ICheckAuthorityService } from '../../../../../app/providers/user/ICheckAuthorityService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { MakeGroupAdminUseCase } from '../../../../../app/useCases/user/group/implementations/MakeGroupAdminUseCase';
import { IMakeGroupAdminUseCase } from '../../../../../app/useCases/user/group/interfaces/IMakeGroupAdminUseCase';
import { makeGroupAdminController } from '../../../../../presentation/http/controller/user/group/makeGroupAdminController';
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

export function makeGroupAdminComposer(): IController {
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
  const useCase: IMakeGroupAdminUseCase = new MakeGroupAdminUseCase(
    conWriteRepo,
    checkAdminService,
    receiverService,
    eventQueueService
  );

  const controller: IController = new makeGroupAdminController(useCase);
  return controller;
}
