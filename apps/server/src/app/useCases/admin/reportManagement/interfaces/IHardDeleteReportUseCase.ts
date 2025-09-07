import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IHardDeleteReportUseCase {
  execute(  reportId: string
): Promise<ResponseDTO>;
}
