import { IController } from '../../../../../app/providers/controller/IController';
import { PlanReadRepo } from '../../../../repositories/planRepo/PlanReadRepo';
import { getAllPlansController } from '../../../../../presentation/http/controller/admin/planManagement/getAllPlansController';
import { IGetAllPlansUseCase } from '../../../../../app/useCases/admin/planManagement/interfaces/IGetAllPlansUseCase';
import { GetAllPlansUseCase } from '../../../../../app/useCases/admin/planManagement/implementations/GetAllPlansUseCase';

export function getAllPlansComposer(): IController {
  const useCase: IGetAllPlansUseCase = new GetAllPlansUseCase(
    new PlanReadRepo()
  );
  const controller: IController = new getAllPlansController(useCase);
  return controller;
}
