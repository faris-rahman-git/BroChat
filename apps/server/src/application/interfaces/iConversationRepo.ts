import {
  CheckConversationExistsType,
  FindReceiverIdType,
} from '../../domain/entities/conversationTypes';
import { CreateGroupType, usersList } from '../../domain/entities/homeTypes';
import { GroupChatListType, updateGroupInfoType } from '@bro/shared';

export interface iConversationRepo {
  findDMs(userId: string): Promise<usersList[]>;
  findGroups(userId: string): Promise<GroupChatListType[]>;

  findDMsIds(userId: string): Promise<string[]>;

  findReceiverId(conversationId: string): Promise<FindReceiverIdType>;
  checkConversationExists(
    userId: string,
    receiverId: string
  ): Promise<CheckConversationExistsType | null>;

  createNewConversation(userId: string, receiverId: string): Promise<string>;
  createNewGroup(
    userId: string,
    groupName: string,
    groupMembers: string[],
    groupAvatarUrl: string
  ): Promise<CreateGroupType>;

  findGroupAdminIds(conversationId: string): Promise<string[]>;
  removeGroupMember(conversationId: string, memberId: string): Promise<void>;
  makeGroupAdmin(conversationId: string, memberId: string): Promise<void>;
  dismissGroupAdmin(conversationId: string, memberId: string): Promise<void>;
  addMoreParticipants(
    conversationId: string,
    newMembersId: string[]
  ): Promise<void>;

  findConversationById(conversationId: string): Promise<GroupChatListType>;

  updateGroupInfo(
    conversationId: string,
    groupInfo: updateGroupInfoType
  ): Promise<void>;
}
