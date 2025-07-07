import { iConversationRepo } from '../../interfaces/iConversationRepo';
import { iUserRepo } from '../../interfaces/iUserRepo';
import { emitNewUserToReceiver } from '../../services/socket/emitNewUserToReceiver';

export const createNewConversationHelper = async (
  conRepo: iConversationRepo,
  repo: iUserRepo,
  userId: string,
  receiverId: string
) => {
  const conversationExist = await conRepo.checkConversationExists(
    userId,
    receiverId
  );

  if (conversationExist?._id) {
    return conversationExist._id;
  }

  const newConversation = await conRepo.createNewConversation(
    userId,
    receiverId
  );

  await emitNewUserToReceiver(repo, userId, receiverId, newConversation._id);

  return newConversation._id;
};
