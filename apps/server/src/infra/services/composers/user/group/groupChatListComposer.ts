import { IController } from '../../../../../app/providers/controller/IController';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { SortGroupListService } from '../../../../providers/user/SortGroupListService';
import { ISortGroupListService } from '../../../../../app/providers/user/ISortGroupListService';
import { GroupChatListUseCase } from '../../../../../app/useCases/user/group/implementations/GroupChatListUseCase';
import { IGroupChatListUseCase } from '../../../../../app/useCases/user/group/interfaces/IGroupChatListUseCase';
import { groupChatListController } from '../../../../../presentation/http/controller/user/group/groupChatListController';

export function groupChatListComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const sortGroupListService: ISortGroupListService = new SortGroupListService();
  const useCase: IGroupChatListUseCase = new GroupChatListUseCase(
    conReadRepo,
    sortGroupListService
  );

  const controller: IController = new groupChatListController(useCase);
  return controller;
}
