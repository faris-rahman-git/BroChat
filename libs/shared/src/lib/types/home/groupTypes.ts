export type GroupChatListType = {
  _id: string;
  participants: GroupMember[];
  Admins: string[];
  groupName?: string | null;
  about?: string | null;
  createdAt: Date;
  createdBy: string;
  avatar?: string | null;
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
