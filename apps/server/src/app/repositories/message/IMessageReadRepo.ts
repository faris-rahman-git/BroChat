import { MessageType, StatsReturn } from '@bro/shared';

export interface IMessageReadRepo {
  findByTempId(tempId: string): Promise<string | null>;
  findMessages(conversationId: string, userId: string): Promise<MessageType[]>;
  findMessageCreatedAt(message: string): Promise<string | Date>;

  getChatStatsData(): Promise<StatsReturn>;
}
