import { IController } from '../../../../../app/providers/controller/IController';
import { IReportDeleteRepo } from '../../../../../app/repositories/report/IReportDeleteRepo';
import { ReportDeleteRepo } from '../../../../repositories/reportRepo/ReportDeleteRepo';
import { IHardDeleteReportUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IHardDeleteReportUseCase';
import { hardDeleteReportController } from '../../../../../presentation/http/controller/admin/reportManagement/hardDeleteReportController';
import { HardDeleteReportUseCase } from '../../../../../app/useCases/admin/reportManagement/implementations/HardDeleteReportUseCase';

export function hardDeleteReportComposer(): IController {
  const repDeleteRepo: IReportDeleteRepo = new ReportDeleteRepo();
  const useCase: IHardDeleteReportUseCase = new HardDeleteReportUseCase(
    repDeleteRepo
  );

  const controller: IController = new hardDeleteReportController(useCase);
  return controller;
}
