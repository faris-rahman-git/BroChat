import { IController } from '../../../../../app/providers/controller/IController';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { getDeletedGroupsController } from '../../../../../presentation/http/controller/admin/groupManagement/getDeletedGroupsController';
import { GetDeletedGroupsUseCase } from '../../../../../app/useCases/admin/groupManagement/implementations/GetDeletedGroupsUseCase';
import { IGetDeletedGroupsUseCase } from '../../../../../app/useCases/admin/groupManagement/interfaces/IGetDeletedGroupsUseCase';

export function getDeletedGroupsComposer(): IController {
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const useCase: IGetDeletedGroupsUseCase = new GetDeletedGroupsUseCase(
    conReadRepo
  );

  const controller: IController = new getDeletedGroupsController(useCase);
  return controller;
}
