import { iReceiverService } from '../../../app/providers/common/iReceiverService';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';

export class ReceiverService implements iReceiverService {
  constructor(private conReadRepo: IConversationReadRepo) {}

  async getReceiverIds(
    conversationId: string,
    userId: string
  ): Promise<string[]> {
    const participants = await this.conReadRepo.findReceiverId(conversationId);

    return participants.filter((id) => id !== userId);
  }
}
