import { ISocketController } from '../../../../app/providers/controller/ISocketController';
import { IEventQueueService } from '../../../../app/providers/socket/IEventQueueService';
import { WebAcceptCallUseCase } from '../../../../app/socketUseCase/call/implementations/WebAcceptCallUseCase';
import { IWebAcceptCallUseCase } from '../../../../app/socketUseCase/call/interfaces/IWebAcceptCallUseCase';
import { webAcceptCallController } from '../../../../presentation/socket/controllers/call/webAcceptCallController';
import { EventQueueService } from '../../../providers/socket/EventQueueService';
import { ConversationReadRepo } from '../../../repositories/conversationRepo/ConversationReadRepo';
import { OfflineQueueRepo } from '../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../repositories/userRepo/UserReadRepo';

export function webAcceptCallComposer(): ISocketController {
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    new ConversationReadRepo(),
    new UserReadRepo()
  );
  const useCase: IWebAcceptCallUseCase = new WebAcceptCallUseCase(
    eventQueueService,
  );
  const controller: ISocketController = new webAcceptCallController(useCase);
  return controller;
}
