import { ObjectId } from 'mongoose';
import { iConversationRepo } from '../../interfaces/iConversationRepo';

export const getReceiverId = async (
  conRepo: iConversationRepo,
  conversationId: string,
  userId: string
) => {
  const conversation = await conRepo.findReceiverId(conversationId);
  const receiverId = conversation.participants.find(
    (id: ObjectId) => id.toString() !== userId
  )!;
  return receiverId.toString();
};
