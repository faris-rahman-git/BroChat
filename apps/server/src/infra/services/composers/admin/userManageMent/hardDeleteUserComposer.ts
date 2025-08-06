import { IController } from '../../../../../app/providers/controller/IController';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { HardDeleteUserUseCase } from '../../../../../app/useCases/admin/userManageMent/implementations/HardDeleteUserUseCase';
import { IHardDeleteUserUseCase } from '../../../../../app/useCases/admin/userManageMent/interfaces/IHardDeleteUserUseCase';
import { hardDeleteUserController } from '../../../../../presentation/http/controller/admin/userManagement/hardDeleteUserController';
import { IEventQueueService } from '../../../../../app/providers/socket/IEventQueueService';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { IOfflineQueueRepo } from '../../../../../app/repositories/redis/IOfflineQueueRepo';
import { ITypingQueueRepo } from '../../../../../app/repositories/redis/ITypingQueueRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';
import { EventQueueService } from '../../../../providers/socket/EventQueueService';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { OfflineQueueRepo } from '../../../../repositories/redisRepo/OfflineQueueRepo';
import { TypingQueueRepo } from '../../../../repositories/redisRepo/TypingQueueRepo';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { DeleteService } from '../../../../providers/auth/DeleteService';
import { IDeleteService } from '../../../../../app/providers/auth/IDeleteService';
import { UserDeleteRepo } from '../../../../repositories/userRepo/UserDeleteRepo';
import { IUserDeleteRepo } from '../../../../../app/repositories/user/IUserDeleteRepo';
import { IMessageDeleteRepo } from '../../../../../app/repositories/message/IMessageDeleteRepo';
import { MessageDeleteRepo } from '../../../../repositories/messageRepo/MessageDeleteRepo';
import { IConversationDeleteRepo } from '../../../../../app/repositories/conversation/IConversationDeleteRepo';
import { ConversationDeleteRepo } from '../../../../repositories/conversationRepo/ConversationDeleteRepo';
import { ReportDeleteRepo } from '../../../../repositories/reportRepo/ReportDeleteRepo';
import { IReportDeleteRepo } from '../../../../../app/repositories/report/IReportDeleteRepo';

export function hardDeleteUserComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const offlineQueueRepo: IOfflineQueueRepo = new OfflineQueueRepo();
  const typingQueueRepo: ITypingQueueRepo = new TypingQueueRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const eventQueueService: IEventQueueService = new EventQueueService(
    offlineQueueRepo,
    typingQueueRepo,
    userManagementRepo,
    conReadRepo,
    userReadRepo
  );
  const userDeleteRepo: IUserDeleteRepo = new UserDeleteRepo();
  const mesDeleteRepo: IMessageDeleteRepo = new MessageDeleteRepo();
  const conDeleteRepo: IConversationDeleteRepo = new ConversationDeleteRepo();
  const repDeleteRepo: IReportDeleteRepo = new ReportDeleteRepo();
  const deleteService: IDeleteService = new DeleteService(
    userDeleteRepo,
    mesDeleteRepo,
    conDeleteRepo,
    repDeleteRepo
  );
  const useCase: IHardDeleteUserUseCase = new HardDeleteUserUseCase(
    userReadRepo,
    eventQueueService,
    deleteService
  );

  const controller: IController = new hardDeleteUserController(useCase);
  return controller;
}
