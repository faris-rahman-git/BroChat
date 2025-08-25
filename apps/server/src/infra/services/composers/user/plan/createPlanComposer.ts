import { IController } from '../../../../../app/providers/controller/IController';
import { createPlanController } from '../../../../../presentation/http/controller/user/plan/createPlanController';
import { ICreatePlanUseCase } from '../../../../../app/useCases/user/plan/interfaces/ICreatePlanUseCase';
import { CreatePlanUseCase } from '../../../../../app/useCases/user/plan/implementations/CreatePlanUseCase';
import { PlanWriteRepo } from '../../../../repositories/planRepo/PlanWriteRepo';
import { PlanReadRepo } from '../../../../repositories/planRepo/PlanReadRepo';

export function createPlanComposer(): IController {
  const useCase: ICreatePlanUseCase = new CreatePlanUseCase(
    new PlanWriteRepo(),
    new PlanReadRepo()
  );

  const controller: IController = new createPlanController(useCase);
  return controller;
}
