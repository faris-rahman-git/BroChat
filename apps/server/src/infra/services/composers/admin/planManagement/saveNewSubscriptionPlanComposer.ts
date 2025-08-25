import { IController } from '../../../../../app/providers/controller/IController';
import { PlanReadRepo } from '../../../../repositories/planRepo/PlanReadRepo';
import { PlanWriteRepo } from '../../../../repositories/planRepo/PlanWriteRepo';
import { ISaveNewSubscriptionPlanUseCase } from '../../../../../app/useCases/admin/planManagement/interfaces/ISaveNewSubscriptionPlanUseCase';
import { saveNewSubscriptionPlanController } from '../../../../../presentation/http/controller/admin/planManagement/saveNewSubscriptionPlanController';
import { SaveNewSubscriptionPlanUseCase } from '../../../../../app/useCases/admin/planManagement/implementations/SaveNewSubscriptionPlanUseCase';

export function saveNewSubscriptionPlanComposer(): IController {
  const useCase: ISaveNewSubscriptionPlanUseCase =
    new SaveNewSubscriptionPlanUseCase(new PlanWriteRepo(), new PlanReadRepo());
  const controller: IController = new saveNewSubscriptionPlanController(
    useCase
  );
  return controller;
}
