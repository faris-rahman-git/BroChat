import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IIgnoreReportUseCase {
  execute(reportId: string, note: string): Promise<ResponseDTO>;
}
