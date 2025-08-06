import { MessageType } from '@bro/shared';
export interface ISendMessageUseCase {
  execute(data: MessageType, userId: string): Promise<boolean>;
}
