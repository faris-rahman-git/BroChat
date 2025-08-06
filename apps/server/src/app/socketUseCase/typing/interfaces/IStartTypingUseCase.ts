import { TypingType } from '../../../dtos/socketTypes';
export interface IStartTypingUseCase {
  execute(data: TypingType, userId: string): Promise<boolean>;
}
