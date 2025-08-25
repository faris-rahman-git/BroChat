import { IController } from '../../../../../app/providers/controller/IController';
import { PlanReadRepo } from '../../../../repositories/planRepo/PlanReadRepo';
import { getExclusiveCustomPlanController } from '../../../../../presentation/http/controller/user/plan/getExclusiveCustomPlanController';
import { IGetExclusiveCustomPlanUseCase } from '../../../../../app/useCases/user/plan/interfaces/IGetExclusiveCustomPlanUseCase';
import { GetExclusiveCustomPlanUseCase } from '../../../../../app/useCases/user/plan/implementations/GetExclusiveCustomPlanUseCase';

export function getExclusiveCustomPlanComposer(): IController {
  const useCase: IGetExclusiveCustomPlanUseCase = new GetExclusiveCustomPlanUseCase(
    new PlanReadRepo()
  );

  const controller: IController = new getExclusiveCustomPlanController(useCase);
  return controller;
}
