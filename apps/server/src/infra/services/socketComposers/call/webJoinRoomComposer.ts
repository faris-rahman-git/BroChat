import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { WebJoinRoomUseCase } from '../../../../app/socketUseCase/call/implementations/WebJoinRoomUseCase';
import { IWebJoinRoomUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebJoinRoomUseCase';
import { webJoinRoomController } from '../../../../presentation/socket/controllers/call/webJoinRoomController';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { CallReadRepo } from '../../../repositories/callRepo/CallReadRepo';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';
import { CallRoomRepo } from '../../../repositories/redisRepo/CallRoomRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';

export function webJoinRoomComposer(): ISocketController {
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    new ConversationReadRepo(),
    new UserReadRepo()
  );
  const useCase: IWebJoinRoomUseCase = new WebJoinRoomUseCase(
    eventQueueService,
    new CallRoomRepo(),
    new UserReadRepo(),
    new CallReadRepo()
  );
  const controller: ISocketController = new webJoinRoomController(useCase);
  return controller;
}
