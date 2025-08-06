import { IController } from '../../../../../app/providers/controller/IController';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';
import { getAllGroupsController } from '../../../../../presentation/http/controller/admin/groupManagement/getAllGroupsController';
import { IGetAllGroupsUseCase } from '../../../../../app/useCases/admin/groupManagement/interfaces/IGetAllGroupsUseCase';
import { GetAllGroupsUseCase } from '../../../../../app/useCases/admin/groupManagement/implementations/GetAllGroupsUseCase';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';

export function getAllGroupsComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const queryService: IQueryService = new QueryService();
  const useCase: IGetAllGroupsUseCase = new GetAllGroupsUseCase(
    conReadRepo,
    queryService
  );

  const controller: IController = new getAllGroupsController(useCase);
  return controller;
}
