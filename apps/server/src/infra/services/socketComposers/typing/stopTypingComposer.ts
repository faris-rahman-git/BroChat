import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IUserManagementRepo } from '../../../../app/repositories/redis/IUserManagementRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { IOfflineQueueRepo } from '../../../../app/repositories/redis/IOfflineQueueRepo';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { ITypingQueueRepo } from '../../../../app/repositories/redis/ITypingQueueRepo';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../app/repositories/conversation/IConversationReadRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';
import { IUserReadRepo } from '../../../../app/repositories/user/IUserReadRepo';
import { stopTypingController } from '../../../../presentation/socket/controllers/typing/stopTypingController';
import { StopTypingUseCase } from '../../../../app/socketUseCase/typing/implementations/StopTypingUseCase';
import { IStopTypingUseCase } from '../../../../app/socketUseCase/typing/interfaces/IStopTypingUseCase';

export function stopTypingComposer(): ISocketController {
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );
  const useCase: IStopTypingUseCase = new StopTypingUseCase(
    typingQueueRepo,
    eventQueueService
  );

  const controller: ISocketController = new stopTypingController(useCase);
  return controller;
}
