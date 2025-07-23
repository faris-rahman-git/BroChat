import { SearchRawType } from '../../../domain/entities/homeTypes';
import { getSocketIdByUserId } from '../../../infrastructure/services/socketServices/getReceiverSocketId';
import { iConversationRepo } from '../../interfaces/iConversationRepo';

export const findUsersWithConversationIds = async (
  matchedUsers: SearchRawType[],
  conRepo: iConversationRepo,
  userId: string
) => {
  const result = [];
  for (const receiver of matchedUsers) {
    const conversation = await conRepo.checkConversationExists(
      userId,
      receiver._id.toString()
    );

    const socketId = await getSocketIdByUserId(receiver._id.toString());

    const blockedUsersStr =
      receiver.blockedUsers?.map((id) => id.toString()) ?? [];
    const blockedByUsersStr =
      receiver.blockedByUsers?.map((id) => id.toString()) ?? [];

    result.push({
      conversationId: conversation?._id.toString() || null,
      receiverId: receiver._id.toString(),
      name: receiver.name,
      email: receiver.email,
      username: receiver.username,
      avatar: receiver.avatar,
      about: receiver.about,
      phoneNumber: receiver.phoneNumber,
      createdAt: receiver.createdAt,
      isOnline: !!socketId,
      hasBlockedMe: blockedUsersStr.includes(userId),
      isBlockedByMe: blockedByUsersStr.includes(userId),
    });
  }
  return result;
};
