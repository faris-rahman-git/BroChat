import { iMessageRepo } from '../../interfaces/iMessageRepo';
import { MessageType } from '@bro/shared';

export const messagesHelper = async (
  conversationId: string,
  messRepo: iMessageRepo
): Promise<MessageType[]> => {
  const messages: MessageType[] = await messRepo.findMessages(conversationId);
  return messages;
};
