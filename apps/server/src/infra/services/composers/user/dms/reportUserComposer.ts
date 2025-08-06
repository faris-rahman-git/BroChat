import { IController } from '../../../../../app/providers/controller/IController';
import { IReportUserUseCase } from '../../../../../app/useCases/user/dms/interfaces/IReportUserUseCase';
import { IReportWriteRepo } from '../../../../../app/repositories/report/IReportWriteRepo';
import { ReportWriteRepo } from '../../../../repositories/reportRepo/ReportWriteRepo';
import { reportUserController } from '../../../../../presentation/http/controller/user/dms/reportUserController';
import { ReportUserUseCase } from '../../../../../app/useCases/user/dms/implementations/ReportUserUseCase';

export function reportUserComposer(): IController {
  const reportWriteRepo: IReportWriteRepo = new ReportWriteRepo();
  const useCase: IReportUserUseCase = new ReportUserUseCase(reportWriteRepo);
  const controller: IController = new reportUserController(useCase);
  return controller;
}
