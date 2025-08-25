import { GroupMember, SubscriptionDetailsType } from '@bro/shared';
export type Receiver = {
  conversationId: string | null;
  avatar?: string | null;
  createdAt: Date | null;
  name?: string | null;
  about?: string | null;

  receiverId?: string | null;
  email?: string | null;
  phoneNumber?: number | null;
  username?: string | null;
  isOnline?: boolean;
  isTyping?: boolean;

  isGroup?: boolean;

  isBlockedByMe?: boolean;
  hasBlockedMe?: boolean;

  isSubscribed?: boolean;

  isBlocked?: boolean;

  isExclusive?: boolean;
};

export type UserReduxType = {
  id: string | null;
  name: string | null;
  username: string | null;
  phoneNumber: number | null;
  avatar: string | null;
  about: string | null;
  email: string | null;
  blockedUsers: GroupMember[] | null;
  role: string | null;
  isLoading: boolean;
  isExclusive?: boolean;
} & SubscriptionDetailsType;
