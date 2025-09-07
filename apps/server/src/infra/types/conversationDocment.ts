import { ObjectId } from 'mongoose';
import { populatedSenderIdType } from './messageDocumet';

export type populatedParticipantType = {
  _id: ObjectId;
  name: string;
  avatar: string;
  username: string;
  email: string;
  phoneNumber: number;
  about: string;
  blockedUsers: ObjectId[];
  blockedByUsers: ObjectId[];
  createdAt: Date;
  isSubscribed: boolean;
  isExclusive: boolean;
};

export type populatedGroupParticipantType = populatedSenderIdType & {
    username: string;
};