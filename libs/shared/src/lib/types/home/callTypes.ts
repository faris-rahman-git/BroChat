export type CallInvite = {
  conversationId: string;
  callUrl: string;
  isVideoCall: boolean;
  initiatedAt: Date;
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
  callerId: userDetailstype ;
  roomId: string;
  receivers: receiversType[];
  isVideoCall: boolean;
  isGroupCall: boolean;
  initiatedAt: Date;
  startedAt: Date;
  endedAt: Date;
  duration: Number;
};

export type callInfoType = {
  userName: string;
  userAvatar: string;
  video: boolean;
  audio: boolean;
};
