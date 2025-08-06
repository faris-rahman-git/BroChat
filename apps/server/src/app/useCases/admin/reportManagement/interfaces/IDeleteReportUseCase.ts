import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IDeleteReportUseCase {
  execute(reportId: string, note: string): Promise<ResponseDTO>;
}
