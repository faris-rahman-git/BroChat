import { IController } from '../../../../../app/providers/controller/IController';
import { GetAllRepotsUseCase } from '../../../../../app/useCases/admin/reportManagement/implementations/GetAllRepotsUseCase';
import { ReportReadRepo } from '../../../../repositories/reportRepo/ReportReadRepo';
import { IReportReadRepo } from '../../../../../app/repositories/report/IReportReadRepo';
import { getAllRepotsController } from '../../../../../presentation/http/controller/admin/reportManagement/getAllRepotsController';
import { IGetAllRepotsUseCase } from '../../../../../app/useCases/admin/reportManagement/interfaces/IGetAllRepotsUseCase';
import { IQueryService } from '../../../../../app/providers/admin/IQueryService';
import { QueryService } from '../../../../providers/admin/QueryService';

export function getAllRepotsComposer(): IController {
  const repReadRepo: IReportReadRepo = new ReportReadRepo();
  const queryService:IQueryService = new QueryService();
  const useCase: IGetAllRepotsUseCase = new GetAllRepotsUseCase(repReadRepo,queryService);

  const controller: IController = new getAllRepotsController(useCase);
  return controller;
}
