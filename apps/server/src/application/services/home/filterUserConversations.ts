import { SearchRawType, usersList } from '../../../domain/entities/homeTypes';
import { getSocketIdByUserId } from '../../../infrastructure/services/socketServices/getReceiverSocketId';

export const filterUserConversations = async (
  usersList: usersList[],
  userId: string
) => {
  const userConversations = await Promise.all(
    usersList.map(async (Conversation: usersList) => {
      const receiver = Conversation?.participants.find(
        (user: SearchRawType) => {
          return user._id.toString() !== userId;
        }
      )!;

      const socketId = await getSocketIdByUserId(receiver._id.toString());

      return {
        conversationId: Conversation._id.toString(),
        receiverId: receiver._id.toString(),
        name: receiver.name,
        email: receiver.email,
        phoneNumber: receiver.phoneNumber,
        username: receiver.username,
        avatar: receiver.avatar,
        createdAt: receiver.createdAt,
        isOnline: !!socketId,
      };
    })
  );

  return userConversations;
};
