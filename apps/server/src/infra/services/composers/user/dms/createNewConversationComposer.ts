import { IController } from '../../../../../app/providers/controller/IController';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { CreateNewConversationUseCase } from '../../../../../app/useCases/user/dms/implementations/CreateNewConversationUseCase';
import { ICreateNewConversationUseCaseUseCase } from '../../../../../app/useCases/user/dms/interfaces/ICreateNewConversationUseCaseUseCase';
import { ConversationWriteRepo } from '../../../../repositories/conversationRepo/ConversationWriteRepo';
import { IConversationWriteRepo } from '../../../../../app/repositories/conversation/IConversationWriteRepo';
import { createNewConversationController } from '../../../../../presentation/http/controller/user/dms/createNewConversationController';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';

export function createNewConversationComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const conWriteRepo: IConversationWriteRepo = new ConversationWriteRepo();
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
  const useCase: ICreateNewConversationUseCaseUseCase =
    new CreateNewConversationUseCase(conReadRepo, conWriteRepo ,eventQueueService);
  const controller: IController = new createNewConversationController(useCase);
  return controller;
}
