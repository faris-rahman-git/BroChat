import { iConversationRepo } from '../../interfaces/iConversationRepo';
import { iMessageRepo } from '../../interfaces/iMessageRepo';
import { getReceiverId } from '../../services/socket/getReceiverId';
import { EditMessageType } from '@bro/shared';

export const editMessageHelper = async (
  data: EditMessageType,
  messRepo: iMessageRepo,
  conRepo: iConversationRepo,
  userId: string
): Promise<string[]> => {
  await messRepo.editMessage(data.messageId, data.message, userId);

  const receiversId = await getReceiverId(conRepo, data.conversationId, userId);
  return receiversId;
};
