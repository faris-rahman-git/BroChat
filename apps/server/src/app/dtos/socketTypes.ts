import { MessageStatusType } from '@bro/shared';
export type EmitWithQueueType = {
  userId: string;
  event: string;
  data: any;
  isDirect?: boolean;
};

export type emitToUserWithTimerType = {
  socketId: string;
  event: string;
  data: any;
};

export type statusUpdateType = {
  messageId: string;
  senderId: string;
  status: MessageStatusType;
};

export type TypingType = {
  receiverId: string;
};
