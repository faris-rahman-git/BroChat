import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IHardDeleteReportUseCase {
  execute(  reportId: string
): Promise<ResponseDTO>;
}
