import { statusUpdateType } from '../../../dtos/socketTypes';
export interface IStatusUpdateUseCase {
  execute(data: statusUpdateType, userId: string): Promise<boolean>;
}
