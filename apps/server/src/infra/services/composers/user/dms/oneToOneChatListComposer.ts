import { IController } from '../../../../../app/providers/controller/IController';
import { OneToOneChatListUseCase } from '../../../../../app/useCases/user/dms/implementations/OneToOneChatListUseCase';
import { IOneToOneChatListUseCase } from '../../../../../app/useCases/user/dms/interfaces/IOneToOneChatListUseCase';
import { oneToOneChatListController } from '../../../../../presentation/http/controller/user/dms/oneToOneChatListController';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IDmFilterService } from '../../../../../app/providers/user/IDmFilterService';
import { DmFilterService } from '../../../../providers/user/DmFilterService';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';

export function oneToOneChatListComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const dmFilterService: IDmFilterService = new DmFilterService(conReadRepo , userManagementRepo);
  const useCase: IOneToOneChatListUseCase = new OneToOneChatListUseCase(
    conReadRepo,
    dmFilterService
  );
  const controller: IController = new oneToOneChatListController(useCase);
  return controller;
}
