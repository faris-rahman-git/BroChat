export type GroupChatListType = {
  _id: string;
  participants: GroupMember[];
  Admins: string[];
  groupName?: string | null;
  about?: string | null;
  createdAt: Date;
  createdBy: string;
  avatar?: string | null;
  isPaid?: boolean;
  isBlocked: boolean;
  blockedAt?: Date | null;
};

export type GroupChatType = Omit<GroupChatListType, 'createdBy'> & {
  createdBy: GroupMember;
};

export type DeleteGroupsReturnType = GroupChatType & {
  isDeleted: boolean;
  deletedAt?: Date | null;
};

export type GroupMember = {
  _id: string;
  name: string;
  avatar: string;
  username: string;
};

export type updateGroupInfoType = {
  groupName?: string | null;
  about?: string | null;
  avatar?: string | null;
};

export type findConversationNameType = {
  name: string;
  avatar: string;
};
