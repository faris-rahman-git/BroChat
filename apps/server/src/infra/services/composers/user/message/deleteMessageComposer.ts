import { IController } from '../../../../../app/providers/controller/IController';
import { IMessageDeleteRepo } from '../../../../../app/repositories/message/IMessageDeleteRepo';
import { MessageDeleteRepo } from '../../../../repositories/messageRepo/MessageDeleteRepo';
import { ReceiverService } from '../../../../providers/common/ReceiverService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { iReceiverService } from '../../../../../app/providers/common/iReceiverService';
import { deleteMessageController } from '../../../../../presentation/http/controller/user/message/deleteMessageController';
import { IDeleteMessageUseCase } from '../../../../../app/useCases/user/message/interfaces/IDeleteMessageUseCase';
import { DeleteMessageUseCase } from '../../../../../app/useCases/user/message/implementations/DeleteMessageUseCase';
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
import { IMessageReadRepo } from '../../../../../app/repositories/message/IMessageReadRepo';
import { MessageReadRepo } from '../../../../repositories/messageRepo/MessageReadRepo';
import { getMinutesSince } from '@bro/shared';

export function deleteMessageComposer(): IController {
  const mesDeleteRepo: IMessageDeleteRepo = new MessageDeleteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
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
  const MesReadRepo: IMessageReadRepo = new MessageReadRepo();
  const useCase: IDeleteMessageUseCase = new DeleteMessageUseCase(
    mesDeleteRepo,
    receiverService,
    eventQueueService,
    MesReadRepo,
    userReadRepo,
    getMinutesSince
  );

  const controller: IController = new deleteMessageController(useCase);
  return controller;
}
