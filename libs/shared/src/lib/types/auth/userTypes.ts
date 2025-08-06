import { GroupMember } from '../home/groupTypes.js';
import { subscriptionPlan } from '../home/subscriptionTypes.js';

export type userDetailsType = {
  id: string;
  name: string;
  username: string;
  phoneNumber?: number | null;
  avatar: string;
  about: string;
  email: string;
  blockedUsers: GroupMember[];
  role: string;
  isSubscribed: boolean;
  subscriptionPlan?: subscriptionPlan | null;
  subscriptionStart?: string | null | Date;
  subscriptionEnd?: string | null | Date;
};
