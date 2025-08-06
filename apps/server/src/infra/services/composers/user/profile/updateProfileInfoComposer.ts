import { IController } from '../../../../../app/providers/controller/IController';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { updateProfileInfoController } from '../../../../../presentation/http/controller/user/profile/updateProfileInfoController';
import { UpdateProfileInfoUseCase } from '../../../../../app/useCases/user/profile/implementations/UpdateProfileInfoUseCase';
import { IUpdateProfileInfoUseCase } from '../../../../../app/useCases/user/profile/interfaces/IUpdateProfileInfoUseCase';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';

export function updateProfileInfoComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    userReadRepo
  );
  const useCase: IUpdateProfileInfoUseCase = new UpdateProfileInfoUseCase(
    userReadRepo,
    new UserWriteRepo(),
    conReadRepo,
    eventQueueService
  );
  const controller: IController = new updateProfileInfoController(useCase);
  return controller;
}
