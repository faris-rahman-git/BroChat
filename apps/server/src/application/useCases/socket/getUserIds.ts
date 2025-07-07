import { iConversationRepo } from '../../interfaces/iConversationRepo';

export const getUserIds = async (
  conRepo: iConversationRepo,
  userId: string
): Promise<string[]> => {
  const usersList = await conRepo.findDMsIds(userId);
  return usersList;
};
