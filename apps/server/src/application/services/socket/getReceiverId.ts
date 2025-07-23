import { iConversationRepo } from '../../interfaces/iConversationRepo';

export const getReceiverId = async (
  conRepo: iConversationRepo,
  conversationId: string,
  userId: string
) => {
  const conversations = await conRepo.findReceiverId(conversationId);

  const result: string[] = [];
  for (const receiverId of conversations.participants) {
    if (receiverId.toString() != userId) {
      result.push(receiverId.toString());
    }
  }
  return result;
};
