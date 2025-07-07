export type SearchResultType = {
  conversationId: string | null;
  receiverId: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  phoneNumber?: number | null;
  createdAt: Date;
  isOnline?: boolean;
  isTyping?: boolean;
};
