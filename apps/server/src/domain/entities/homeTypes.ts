import { SearchResultType } from '@bro/shared';
import { ObjectId } from 'mongoose';

export type SearchRawType = Omit<
  SearchResultType,
  'conversationId' | 'receiverId'
> & {
  _id: string | ObjectId;
};

export type usersList = {
  _id: string | ObjectId;
  participants: SearchRawType[];
};

