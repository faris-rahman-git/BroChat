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
import { ReceiverService } from '../../../providers/common/ReceiverService';
import { iReceiverService } from '../../../../app/providers/common/iReceiverService';
import { MessageWriteRepo } from '../../../repositories/messageRepo/MessageWriteRepo';
import { IMessageWriteRepo } from '../../../../app/repositories/message/IMessageWriteRepo';
import { editMessageController } from '../../../../presentation/socket/controllers/message/editMessageController';
import { IEditMessageUseCase } from '../../../../app/socketUseCase/message/interfaces/IEditMessageUseCase';
import { EditMessageUseCase } from '../../../../app/socketUseCase/message/implementations/EditMessageUseCase';
import { MessageReadRepo } from '../../../repositories/messageRepo/MessageReadRepo';
import { IMessageReadRepo } from '../../../../app/repositories/message/IMessageReadRepo';
import { getMinutesSince } from '@bro/shared';

export function editMessageComposer(): ISocketController {
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
  const receiverService: iReceiverService = new ReceiverService(conReadRepo);
  const MesReadRepo: IMessageReadRepo = new MessageReadRepo();
  const useCase: IEditMessageUseCase = new EditMessageUseCase(
    mesWriteRepo,
    eventQueueService,
    receiverService,
    MesReadRepo,
    userReadRepo,
    getMinutesSince
  );

  const controller: ISocketController = new editMessageController(useCase);
  return controller;
}
