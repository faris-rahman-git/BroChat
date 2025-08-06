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
import { sendMessageController } from '../../../../presentation/socket/controllers/message/sendMessageController';
import { ITempIdCache } from '../../../../app/providers/socket/ITempIdCache';
import { TempIdCache } from '../../../providers/socket/TempIdCache';
import { ISendMessageUseCase } from '../../../../app/socketUseCase/message/interfaces/ISendMessageUseCase';
import { SendMessageUseCase } from '../../../../app/socketUseCase/message/implementations/SendMessageUseCase';
import { MessageReadRepo } from '../../../repositories/messageRepo/MessageReadRepo';
import { IMessageReadRepo } from '../../../../app/repositories/message/IMessageReadRepo';
import { ReceiverService } from '../../../providers/common/ReceiverService';
import { iReceiverService } from '../../../../app/providers/common/iReceiverService';
import { MessageWriteRepo } from '../../../repositories/messageRepo/MessageWriteRepo';
import { IMessageWriteRepo } from '../../../../app/repositories/message/IMessageWriteRepo';

export function sendMessageComposer(): ISocketController {
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const mesWriteRepo: IMessageWriteRepo = new MessageWriteRepo();
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );
  const tempIdCache: ITempIdCache = new TempIdCache();
  const mesReadRepo: IMessageReadRepo = new MessageReadRepo();
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const useCase: ISendMessageUseCase = new SendMessageUseCase(
    mesReadRepo,
    mesWriteRepo,
    eventQueueService,
    receiverService,
    tempIdCache
  );

  const controller: ISocketController = new sendMessageController(useCase);
  return controller;
}
