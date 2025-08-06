import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IIgnoreReportUseCase {
  execute(reportId: string, note: string): Promise<ResponseDTO>;
}
