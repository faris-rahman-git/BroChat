import { IController } from '../../../../../app/providers/controller/IController';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { addReactionController } from '../../../../../presentation/http/controller/user/message/addReactionController';
import { IAddReactionUseCase } from '../../../../../app/useCases/user/message/interfaces/IAddReactionUseCase';
import { AddReactionUseCase } from '../../../../../app/useCases/user/message/implementations/AddReactionUseCase';
import { MessageWriteRepo } from '../../../../repositories/messageRepo/MessageWriteRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';

export function addReactionComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const userReadRepo: IUserReadRepo = new UserReadRepo();

  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    userReadRepo
  );
  const useCase: IAddReactionUseCase = new AddReactionUseCase(
    new MessageWriteRepo(),
    receiverService,
    eventQueueService,
    userReadRepo
  );

  const controller: IController = new addReactionController(useCase);
  return controller;
}
