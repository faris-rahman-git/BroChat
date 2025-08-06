import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';
import { GetReportParams } from '@bro/shared';

export interface IGetAllRepotsUseCase {
  execute(data: GetReportParams): Promise<ResponseDTO>;
}
