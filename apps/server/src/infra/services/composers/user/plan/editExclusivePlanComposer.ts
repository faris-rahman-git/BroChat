import { IController } from '../../../../../app/providers/controller/IController';
import { PlanWriteRepo } from '../../../../repositories/planRepo/PlanWriteRepo';
import { editExclusivePlanController } from '../../../../../presentation/http/controller/user/plan/editExclusivePlanController';
import { IEditExclusivePlanUseCase } from '../../../../../app/useCases/user/plan/interfaces/IEditExclusivePlanUseCase';
import { EditExclusivePlanUseCase } from '../../../../../app/useCases/user/plan/implementations/EditExclusivePlanUseCase';

export function editExclusivePlanComposer(): IController {
  const useCase: IEditExclusivePlanUseCase = new EditExclusivePlanUseCase(
    new PlanWriteRepo()
  );

  const controller: IController = new editExclusivePlanController(useCase);
  return controller;
}
