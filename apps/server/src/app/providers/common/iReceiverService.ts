export interface iReceiverService {
  getReceiverIds(conversationId: string, userId: string): Promise<string[]>;
}
