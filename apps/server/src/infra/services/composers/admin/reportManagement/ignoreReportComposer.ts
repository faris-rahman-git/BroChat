import { IController } from '../../../../../app/providers/controller/IController';
import { IReportWriteRepo } from '../../../../../app/repositories/report/IReportWriteRepo';
import { ReportWriteRepo } from '../../../../repositories/reportRepo/ReportWriteRepo';
import { IgnoreReportUseCase } from '../../../../../app/useCases/admin/reportManagement/implementations/IgnoreReportUseCase';
import { IIgnoreReportUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IIgnoreReportUseCase';
import { ignoreReportController } from '../../../../../presentation/http/controller/admin/reportManagement/ignoreReportController';

export function ignoreReportComposer(): IController {
  const repWriteRepo: IReportWriteRepo = new ReportWriteRepo();
  const useCase: IIgnoreReportUseCase = new IgnoreReportUseCase(repWriteRepo);

  const controller: IController = new ignoreReportController(useCase);
  return controller;
}
