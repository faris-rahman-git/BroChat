export type AllUsersType = {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  blockedAt?: Date | null;
  createdAt: Date;

  name: string;
  phoneNumber?: number | null;
  avatar?: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: string | null;

  isSubscribed?: boolean;
  subscriptionPlan?: string | null;
  subscriptionStart?: Date | null;
  subscriptionEnd?: Date | null;
};

export type MainAllUsersListType = {
  data: AllUsersType[];
  totalPages: number;
};
