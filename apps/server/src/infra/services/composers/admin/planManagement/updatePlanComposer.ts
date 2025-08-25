import { IController } from '../../../../../app/providers/controller/IController';
import { PlanReadRepo } from '../../../../repositories/planRepo/PlanReadRepo';
import { PlanWriteRepo } from '../../../../repositories/planRepo/PlanWriteRepo';
import { updatePlanController } from '../../../../../presentation/http/controller/admin/planManagement/updatePlanController';
import { IUpdatePlanUseCase } from '../../../../../app/useCases/admin/planManagement/interfaces/IUpdatePlanUseCase';
import { UpdatePlanUseCase } from '../../../../../app/useCases/admin/planManagement/implementations/UpdatePlanUseCase';

export function updatePlanComposer(): IController {
  const useCase: IUpdatePlanUseCase = new UpdatePlanUseCase(
    new PlanWriteRepo(),
    new PlanReadRepo()
  );
  const controller: IController = new updatePlanController(useCase);
  return controller;
}
