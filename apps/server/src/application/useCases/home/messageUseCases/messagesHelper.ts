import { MessageType } from '@bro/shared';
import { iMessageRepo } from '../../../interfaces/iMessageRepo';

export const messagesHelper = async (
  messRepo: iMessageRepo,
  conversationId: string,
  userId: string
): Promise<MessageType[]> => {
  const messages: MessageType[] = await messRepo.findMessages(
    conversationId,
    userId
  );
  return messages;
};
