import { CleanExpiredSubscriptionsUseCase } from '../../../app/jobUseCase/implementations/CleanExpiredSubscriptionsUseCase';
import { ICleanExpiredSubscriptionsUseCase } from '../../../app/jobUseCase/interfaces/ICleanExpiredSubscriptionsUseCase';
import { IJobController } from '../../../app/providers/controller/IJobController';
import { ISubscriptionCleanupService } from '../../../app/providers/jobs/ISubscriptionCleanupService';
import { IEventQueueService } from '../../../app/providers/socket/IEventQueueService';
import { IUserReadRepo } from '../../../app/repositories/user/IUserReadRepo';
import { IUserWriteRepo } from '../../../app/repositories/user/IUserWriteRepo';
import { cleanExpiredSubscriptionsController } from '../../../presentation/jobs/controllers/cleanExpiredSubscriptionsController';
import { SubscriptionCleanupService } from '../../providers/jobs/SubscriptionCleanupService';
import { EventQueueService } from '../../providers/socket/EventQueueService';
import { ConversationReadRepo } from '../../repositories/conversationRepo/ConversationReadRepo';
import { OfflineQueueRepo } from '../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../repositories/userRepo/UserReadRepo';
import { UserWriteRepo } from '../../repositories/userRepo/UserWriteRepo';

export function cleanExpiredSubscriptionsComposer(): IJobController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    new OfflineQueueRepo(),
    new TypingQueueRepo(),
    new UserManagementRepo(),
    new ConversationReadRepo(),
    userReadRepo
  );
  const subscriptionCleanupService: ISubscriptionCleanupService =
    new SubscriptionCleanupService(
      userReadRepo,
      userWriteRepo,
      eventQueueService
    );
  const useCase: ICleanExpiredSubscriptionsUseCase =
    new CleanExpiredSubscriptionsUseCase(subscriptionCleanupService , eventQueueService);

  const controller: IJobController = new cleanExpiredSubscriptionsController(
    useCase
  );
  return controller;
}
