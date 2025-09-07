import { ResponseDTO } from '../../../../../domain/entity/return/ResponseDTO';

export interface IGetDashboardUseCase {
  execute(): Promise<ResponseDTO>;
}
