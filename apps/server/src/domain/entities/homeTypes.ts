import { SearchResultType } from '@bro/shared';
import { ObjectId } from 'mongoose';

export type SearchRawType = Omit<
  SearchResultType,
  'conversationId' | 'receiverId' | 'isBlockedByMe' | 'hasBlockedMe'
> & {
  _id: string | ObjectId;
  blockedUsers: ObjectId[];
  blockedByUsers: ObjectId[];
};

export type usersList = {
  _id: string | ObjectId;
  participants: SearchRawType[];
  createdAt: Date;
};

export type CreateGroupType = { _id: string; createdAt: Date };
