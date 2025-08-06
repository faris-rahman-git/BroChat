import { IController } from '../../../../../app/providers/controller/IController';
import { IConversationReadRepo } from '../../../../../app/repositories/conversation/IConversationReadRepo';
import { ConversationReadRepo } from '../../../../repositories/conversationRepo/ConversationReadRepo';
import { hardDeleteGroupController } from '../../../../../presentation/http/controller/admin/groupManagement/hardDeleteGroupController';
import { IHardDeleteGroupUseCase } from '../../../../../app/useCases/admin/groupManagement/interfaces/IHardDeleteGroupUseCase';
import { IConversationDeleteRepo } from '../../../../../app/repositories/conversation/IConversationDeleteRepo';
import { ConversationDeleteRepo } from '../../../../repositories/conversationRepo/ConversationDeleteRepo';
import { HardDeleteGroupUseCase } from '../../../../../app/useCases/admin/groupManagement/implementations/HardDeleteGroupUseCase';

export function hardDeleteGroupComposer(): IController {
  const conDeleteRepo: IConversationDeleteRepo = new ConversationDeleteRepo();
  const conReadRepo: IConversationReadRepo = new ConversationReadRepo();
  const useCase: IHardDeleteGroupUseCase = new HardDeleteGroupUseCase(
    conReadRepo,
    conDeleteRepo
  );

  const controller: IController = new hardDeleteGroupController(useCase);
  return controller;
}
