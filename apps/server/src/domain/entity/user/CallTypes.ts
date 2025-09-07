export interface IUserRef {
  userId: IUserRefPopulated;
}

export interface IUserRefPopulated {
  _id: string;
  name: string;
  avatar: string;
  username: string;
}

export interface IReceiver {
  status: string;
  joinedAt?: Date;
  leftAt?: Date;
  duration?: number;
  userId?: IUserRefPopulated | null;
}

export interface CallListType {
  conversationId: string;
  callerId: IUserRef;
  roomId: string;
  receivers: IReceiver[];
  isVideoCall: boolean;
  isGroupCall: boolean;
  initiatedAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
}
