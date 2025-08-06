import { IController } from '../../../../../app/providers/controller/IController';
import { ReportReadRepo } from '../../../../repositories/reportRepo/ReportReadRepo';
import { IReportReadRepo } from '../../../../../app/repositories/report/IReportReadRepo';
import { GetResolvedRepotsUseCase } from '../../../../../app/useCases/admin/reportManagement/implementations/GetResolvedRepotsUseCase';
import { getResolvedRepotsController } from '../../../../../presentation/http/controller/admin/reportManagement/getResolvedRepotsController';
import { IGetResolvedRepotsUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IGetResolvedRepotsUseCase';

export function getResolvedRepotsComposer(): IController {
  const repReadRepo: IReportReadRepo = new ReportReadRepo();
  const useCase: IGetResolvedRepotsUseCase = new GetResolvedRepotsUseCase(
    repReadRepo
  );

  const controller: IController = new getResolvedRepotsController(useCase);
  return controller;
}
