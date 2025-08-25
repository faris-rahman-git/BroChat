import { ResponseDTO } from '../../../../../domain/dtos/return/ResponseDTO';

export interface IGetDashboardUseCase {
  execute(): Promise<ResponseDTO>;
}
