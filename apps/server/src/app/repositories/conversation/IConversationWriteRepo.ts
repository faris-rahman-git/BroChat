import { updateGroupInfoType } from '@bro/shared';
import { CreateGroupType } from '../../../domain/dtos/user/ConversationRepoTypes';

export interface IConversationWriteRepo {
  createNewConversation(userId: string, receiverId: string): Promise<string>;
  createNewGroup(
    userId: string,
    groupName: string,
    groupMembers: string[],
    groupAvatarUrl: string
  ): Promise<CreateGroupType>;

  removeGroupMember(conversationId: string, memberId: string): Promise<void>;
  makeGroupAdmin(conversationId: string, memberId: string): Promise<void>;
  dismissGroupAdmin(conversationId: string, memberId: string): Promise<void>;
  addMoreParticipants(
    conversationId: string,
    newMembersId: string[]
  ): Promise<void>;
  updateGroupInfo(
    conversationId: string,
    groupInfo: updateGroupInfoType
  ): Promise<void>;

  updatePaidStatus(conversationId: string): Promise<void>;
  updateBlockStatus(conversationId: string, isBlocked: boolean): Promise<void>;

}
