import { IController } from '../../../../../app/providers/controller/IController';
import { ReportReadRepo } from '../../../../repositories/reportRepo/ReportReadRepo';
import { IReportReadRepo } from '../../../../../app/repositories/report/IReportReadRepo';
import { GetDeletedRepotsUseCase } from '../../../../../app/useCases/admin/reportManagement/implementations/GetDeletedRepotsUseCase';
import { IGetDeletedRepotsUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IGetDeletedRepotsUseCase';
import { getDeletedRepotsController } from '../../../../../presentation/http/controller/admin/reportManagement/getDeletedRepotsController';

export function getDeletedRepotsComposer(): IController {
  const repReadRepo: IReportReadRepo = new ReportReadRepo();
  const useCase: IGetDeletedRepotsUseCase = new GetDeletedRepotsUseCase(
    repReadRepo
  );

  const controller: IController = new getDeletedRepotsController(useCase);
  return controller;
}
