import { ObjectId } from 'mongoose';

export type FindReceiverIdType = {
  participants: ObjectId[];
};

export type CheckConversationExistsType = {
  _id: ObjectId;
};