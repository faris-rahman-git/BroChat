export type ReportUserType = {
  reportedUserId: string;
  conversationId: string;
  reason: string;
};

export type SearchResultType = {
  conversationId: string | null;
  receiverId: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  about?: string | null;
  phoneNumber?: number | null;
  createdAt: Date;
  isOnline?: boolean;
  isTyping?: boolean;

  isBlockedByMe?: boolean;
  hasBlockedMe?: boolean;
};
