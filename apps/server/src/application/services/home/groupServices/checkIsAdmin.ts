import { iConversationRepo } from '../../../interfaces/iConversationRepo';

export const checkIsAdmin = async (
  conRepo: iConversationRepo,
  conversationId: string,
  userId: string
) => {
  const groupAdminsId = await conRepo.findGroupAdminIds(conversationId);

  return groupAdminsId.includes(userId);
};
