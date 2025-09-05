import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { WebLeaveRoomUseCase } from '../../../../app/socketUseCase/call/implementations/WebLeaveRoomUseCase';
import { IWebLeaveRoomUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebLeaveRoomUseCase';
import { webLeaveRoomController } from '../../../../presentation/socket/controllers/call/webLeaveRoomController';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { CallReadRepo } from '../../../repositories/callRepo/CallReadRepo';
import { CallWriteRepo } from '../../../repositories/callRepo/CallWriteRepo';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';
import { CallRoomRepo } from '../../../repositories/redisRepo/CallRoomRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';

export function webLeaveRoomComposer(): ISocketController {
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    new ConversationReadRepo(),
    new UserReadRepo()
  );
  const useCase: IWebLeaveRoomUseCase = new WebLeaveRoomUseCase(
    eventQueueService,
    new CallRoomRepo(),
    new CallWriteRepo(),
    new CallReadRepo()
  );
  const controller: ISocketController = new webLeaveRoomController(useCase);
  return controller;
}
