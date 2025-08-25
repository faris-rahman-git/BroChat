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
import { removeReactionController } from '../../../../../presentation/http/controller/user/message/removeReactionController';
import { IRemoveReactionUseCase } from '../../../../../app/useCases/user/message/interfaces/IRemoveReactionUseCase';
import { MessageDeleteRepo } from '../../../../repositories/messageRepo/MessageDeleteRepo';
import { RemoveReactionUseCase } from '../../../../../app/useCases/user/message/implementations/RemoveReactionUseCase';

export function removeReactionComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    conReadRepo,
    new UserReadRepo()
  );
  const useCase: IRemoveReactionUseCase = new RemoveReactionUseCase(
    new MessageDeleteRepo(),
    receiverService,
    eventQueueService,
  );

  const controller: IController = new removeReactionController(useCase);
  return controller;
}
