import { ObjectId } from 'mongodb';
export type DeletedUserListType = {
  _id: string | ObjectId;
  username: string;
  email: string;
  createdAt: Date;
  deletedAt ?: Date | null;
  deletedBy ?: string | null;
};
