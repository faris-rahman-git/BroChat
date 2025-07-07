import { iConversationRepo } from '../../interfaces/iConversationRepo';
import { iMessageRepo } from '../../interfaces/iMessageRepo';
import { getReceiverId } from '../../services/socket/getReceiverId';
import { MessageType } from '@bro/shared';

export const saveMessages = async (
  data: MessageType,
  messRepo: iMessageRepo,
  conRepo: iConversationRepo
): Promise<{ receiverId: string; savedMessage: MessageType }> => {
  const savedMessage: MessageType = await messRepo.save(data);
  const receiverId = await getReceiverId(
    conRepo,
    data.conversationId as string,
    data.senderId as string
  );
  return { receiverId, savedMessage };
};
