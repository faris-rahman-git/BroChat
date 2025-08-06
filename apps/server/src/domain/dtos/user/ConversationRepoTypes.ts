import { SearchRawType } from './UserRepoTypes';

export type usersList = {
  _id: string;
  participants: SearchRawType[];
  createdAt: Date;
};

export type CreateGroupType = { _id: string; createdAt: Date };
