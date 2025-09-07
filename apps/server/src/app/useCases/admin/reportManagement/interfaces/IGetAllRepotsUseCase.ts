import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';
import { GetReportParams } from '@bro/shared';

export interface IGetAllRepotsUseCase {
  execute(data: GetReportParams): Promise<ResponseDTO>;
}
