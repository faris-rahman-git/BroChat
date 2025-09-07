import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IDeleteReportUseCase {
  execute(reportId: string, note: string): Promise<ResponseDTO>;
}
