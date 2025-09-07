import { Types } from 'mongoose';
import { IUserRefPopulated } from '../../domain/entity/user/CallTypes';

export interface IUserDocumentPopulated {
  _id: Types.ObjectId;
  name: string;
  username: string;
  phoneNumber?: number | null;
  avatar: string;
  about: string ;
  email: string;
  blockedUsers: IUserRefPopulated[];
  role: string;
  isSubscribed: boolean;
  subscriptionPlan?: string | null;
  subscriptionStart?: NativeDate | null;
  subscriptionEnd?: NativeDate | null;
  isExclusive: boolean;
}
