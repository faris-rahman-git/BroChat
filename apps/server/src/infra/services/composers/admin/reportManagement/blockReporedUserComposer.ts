import { IController } from '../../../../../app/providers/controller/IController';
import { UserWriteRepo } from '../../../../repositories/userRepo/UserWriteRepo';
import { IUserWriteRepo } from '../../../../../app/repositories/user/IUserWriteRepo';
import { BlockReporedUserUseCase } from '../../../../../app/useCases/admin/reportManagement/implementations/BlockReporedUserUseCase';
import { IReportWriteRepo } from '../../../../../app/repositories/report/IReportWriteRepo';
import { ReportWriteRepo } from '../../../../repositories/reportRepo/ReportWriteRepo';
import { blockReporedUserController } from '../../../../../presentation/http/controller/admin/reportManagement/blockReporedUserController';
import { IBlockReporedUserUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IBlockReporedUserUseCase';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';

export function blockReporedUserComposer(): IController {
  const userWriteRepo: IUserWriteRepo = new UserWriteRepo();
  const repWriteRepo: IReportWriteRepo = new ReportWriteRepo();
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );
  const useCase: IBlockReporedUserUseCase = new BlockReporedUserUseCase(
    userWriteRepo,
    repWriteRepo,
    eventQueueService
  );

  const controller: IController = new blockReporedUserController(useCase);
  return controller;
}
