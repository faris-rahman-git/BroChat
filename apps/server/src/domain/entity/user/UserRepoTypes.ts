import { SearchResultType } from '@bro/shared';

export type SaveUserOutputType = {
  _id: string;
  name?: string | null;
  email: string;
  password?: string | null;
  role: string;
};

export type FindEmailType = SaveUserOutputType & {
  isBlocked?: boolean;
  isDeleted?: boolean;
};

export type SearchRawType = Omit<
  SearchResultType,
  'conversationId' | 'receiverId' | 'isBlockedByMe' | 'hasBlockedMe'
> & {
  _id: string;
  blockedUsers: string[];
  blockedByUsers: string[];
};

export type SaveUserInputType = {
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  password?: string;
};
