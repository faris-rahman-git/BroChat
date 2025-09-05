import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { WebCallUserUseCase } from '../../../../app/socketUseCase/call/implementations/WebCallUserUseCase';
import { IWebCallUserUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebCallUserUseCase';
import { webCallUserController } from '../../../../presentation/socket/controllers/call/webCallUserController';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';
import { CallRoomRepo } from '../../../repositories/redisRepo/CallRoomRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';

export function webCallUserComposer(): ISocketController {
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    new ConversationReadRepo(),
    new UserReadRepo()
  );
  const useCase: IWebCallUserUseCase = new WebCallUserUseCase(
    eventQueueService,
    new CallRoomRepo(),
  );
  const controller: ISocketController = new webCallUserController(useCase);
  return controller;
}
