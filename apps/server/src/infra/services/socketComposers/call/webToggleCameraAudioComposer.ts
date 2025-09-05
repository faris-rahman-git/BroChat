import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { WebToggleCameraAudioUseCase } from '../../../../app/socketUseCase/call/implementations/WebToggleCameraAudioUseCase';
import { IWebToggleCameraAudioUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebToggleCameraAudioUseCase';
import { webToggleCameraAudioController } from '../../../../presentation/socket/controllers/call/webToggleCameraAudioController';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';
import { CallRoomRepo } from '../../../repositories/redisRepo/CallRoomRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';

export function webToggleCameraAudioComposer(): ISocketController {
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    new ConversationReadRepo(),
    new UserReadRepo()
  );
  const useCase: IWebToggleCameraAudioUseCase = new WebToggleCameraAudioUseCase(
    eventQueueService,
    new CallRoomRepo()
  );
  const controller: ISocketController = new webToggleCameraAudioController(useCase);
  return controller;
}
