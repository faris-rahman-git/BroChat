import { IDmFilterService } from '../../../app/providers/user/IDmFilterService';
import { usersList } from '../../../domain/dtos/user/ConversationRepoTypes';
import { SearchResultType } from '@bro/shared';
import { SearchRawType } from '../../../domain/dtos/user/UserRepoTypes';
import { IConversationReadRepo } from '../../../app/repositories/conversation/IConversationReadRepo';
import { IUserManagementRepo } from '../../../app/repositories/redis/IUserManagementRepo';

export class DmFilterService implements IDmFilterService {
  constructor(
    private conReadRepo: IConversationReadRepo,
    private userManagementRepo: IUserManagementRepo
  ) {}

  async filterUserConversationsHelper(
    usersList: usersList[],
    userId: string
  ): Promise<SearchResultType[]> {
    const userConversations = await Promise.all(
      usersList.map(async (Conversation: usersList) => {
        const receiver = Conversation?.participants.find(
          (user: SearchRawType) => {
            return user._id.toString() !== userId;
          }
        )!;

        const socketId = await this.userManagementRepo.findSocketByUserId(
          receiver._id.toString()
        );
        const blockedUsersStr =
          receiver.blockedUsers?.map((id) => id.toString()) ?? [];
        const blockedByUsersStr =
          receiver.blockedByUsers?.map((id) => id.toString()) ?? [];

        return {
          conversationId: Conversation._id.toString(),
          receiverId: receiver._id.toString(),
          name: receiver.name,
          email: receiver.email,
          phoneNumber: receiver.phoneNumber,
          username: receiver.username,
          avatar: receiver.avatar,
          about: receiver.about,
          createdAt: Conversation.createdAt,
          isOnline: !!socketId,
          isSubscribed: receiver.isSubscribed,
          hasBlockedMe: blockedUsersStr.includes(userId),
          isBlockedByMe: blockedByUsersStr.includes(userId),
        };
      })
    );

    return userConversations;
  }

  async findUsersWithConversationIdsHelper(
    matchedUsers: SearchRawType[],
    userId: string
  ): Promise<SearchResultType[]> {
    const result = [];
    for (const receiver of matchedUsers) {
      const conversationId = await this.conReadRepo.checkConversationExists(
        userId,
        receiver._id
      );

      const socketId = await this.userManagementRepo.findSocketByUserId(
        receiver._id
      );

      result.push({
        conversationId,
        receiverId: receiver._id,
        name: receiver.name,
        email: receiver.email,
        username: receiver.username,
        avatar: receiver.avatar,
        about: receiver.about,
        phoneNumber: receiver.phoneNumber,
        createdAt: receiver.createdAt,
        isOnline: !!socketId,
        isSubscribed: receiver.isSubscribed,
        hasBlockedMe: receiver.blockedUsers?.includes(userId),
        isBlockedByMe: receiver.blockedByUsers?.includes(userId),
      });
    }
    return result;
  }
}
