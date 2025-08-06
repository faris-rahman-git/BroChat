import { TypingType } from '../../../dtos/socketTypes';
export interface IStopTypingUseCase {
  execute(data: TypingType, userId: string): Promise<boolean>;
}
