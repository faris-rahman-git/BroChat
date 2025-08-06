import { IController } from '../../../../../app/providers/controller/IController';
import { IReportWriteRepo } from '../../../../../app/repositories/report/IReportWriteRepo';
import { ReportWriteRepo } from '../../../../repositories/reportRepo/ReportWriteRepo';
import { DeleteReportUseCase } from '../../../../../app/useCases/admin/reportManagement/implementations/DeleteReportUseCase';
import { deleteReportController } from '../../../../../presentation/http/controller/admin/reportManagement/deleteReportController';
import { IDeleteReportUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IDeleteReportUseCase';

export function deleteReportComposer(): IController {
  const repWriteRepo: IReportWriteRepo = new ReportWriteRepo();
  const useCase: IDeleteReportUseCase = new DeleteReportUseCase(
    repWriteRepo
  );

  const controller: IController = new deleteReportController(useCase);
  return controller;
}
