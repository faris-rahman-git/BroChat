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

    result.push({
      conversationId: conversation?._id.toString() || null,
      receiverId: receiver._id.toString(),
      name: receiver.name,
      email: receiver.email,
      username: receiver.username,
      avatar: receiver.avatar,
      phoneNumber: receiver.phoneNumber,
      createdAt: receiver.createdAt,
      isOnline: !!socketId,
    });
  }
  return result;
};
