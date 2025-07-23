import { iConversationRepo } from '../../interfaces/iConversationRepo';
import { iMessageRepo } from '../../interfaces/iMessageRepo';
import { getReceiverId } from '../../services/socket/getReceiverId';
import { MessageType } from '@bro/shared';

export const saveMessages = async (
  data: MessageType,
  messRepo: iMessageRepo,
  conRepo: iConversationRepo
): Promise<{ receiversId: string[]; savedMessage: MessageType }> => {
  const receiversId = await getReceiverId(
    conRepo,
    data.conversationId as string,
    data.senderId as string
  );
  const savedMessage: MessageType = await messRepo.save(data , receiversId);
  return { receiversId, savedMessage };
};
