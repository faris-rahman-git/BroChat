export type CallInvite = {
  conversationId: string;
  callUrl: string;
  isVideoCall: boolean;
  startedAt: Date;
  roomId: string;
  isGroupCall: boolean;
};

export type acceptCallApiType = {
  joinedAt: Date;
  roomId: string;
};

export type rejectCallApiType = {
  isGroupCall: boolean;
  roomId: string;
};

export type callLeftApiType = {
  roomId: string;
  leftAt: Date;
};

export type callEndApiType = {
  roomId: string;
  endedAt: Date;
  firstUser: boolean;
};

type receiversType = {
  userId: userDetailstype;
  status: 'missed' | 'accepted' | 'rejected';
  joinedAt: Date;
  leftAt: Date;
  duration: Number;
};

type userDetailstype = {
  _id: string;
  name: string;
  avatar: string;
  username: string;
};

export type callListType = {
  conversationId: string;
  callerId: userDetailstype;
  roomId: string;
  receivers: receiversType[];
  isVideoCall: boolean;
  isGroupCall: boolean;
  startedAt: Date;
  endedAt: Date;
  duration: Number;
};
