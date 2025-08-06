import { EditMessageType } from '@bro/shared';
export interface IEditMessageUseCase {
  execute(data: EditMessageType, userId: string): Promise<boolean>;
}
