import { IController } from '../../../../../app/providers/controller/IController';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { IDmFilterService } from '../../../../../app/providers/user/IDmFilterService';
import { DmFilterService } from '../../../../providers/user/DmFilterService';
import { SearchUserUseCase } from '../../../../../app/useCases/user/dms/implementations/SearchUserUseCase';
import { UserReadRepo } from '../../../../repositories/userRepo/UserReadRepo';
import { IUserReadRepo } from '../../../../../app/repositories/user/IUserReadRepo';
import { ISearchUserUseCase } from '../../../../../app/useCases/user/dms/interfaces/ISearchUserUseCase';
import { SearchUserController } from '../../../../../presentation/http/controller/user/dms/SearchUserController';
import { UserManagementRepo } from '../../../../repositories/redisRepo/UserManagementRepo';
import { IUserManagementRepo } from '../../../../../app/repositories/redis/IUserManagementRepo';

export function searchUserComposer(): IController {
  const userReadRepo: IUserReadRepo = new UserReadRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const userManagementRepo: IUserManagementRepo = new UserManagementRepo();
  const dmFilterService: IDmFilterService = new DmFilterService(
    conReadRepo,
    userManagementRepo
  );
  const useCase: ISearchUserUseCase = new SearchUserUseCase(
    userReadRepo,
    dmFilterService
  );
  const controller: IController = new SearchUserController(useCase);
  return controller;
}
