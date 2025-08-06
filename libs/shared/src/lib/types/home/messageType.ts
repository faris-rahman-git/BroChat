export type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'seen';

export type MessageType = {
  tempId?: string | null;
  _id?: string | null;
  conversationId: string | null;
  senderId: string;
  senderName?: string | null;
  senderAvatar?: string | null;
  MessageType: ContentType;
  content?: string | null;
  mediaUrl?: string | null;
  deliveredBy?: { userId?: string | null; time: Date }[];
  isEdited?: boolean;
  readBy?: { userId?: string | null; time: Date }[];
  status: MessageStatusType;
  messageTime: Date | string;
  createdAt?: Date;
};

export type DeleteMessageType = 'me' | 'everyone';

export type EditMessageType = {
  messageId: string;
  conversationId: string;
  message: string;
};

export type ContentType =
  | 'text'
  | 'image'
  | 'video'
  | 'voice'
  | 'document'
  | 'gif'
  | 'contact'
  | 'poll'
  | 'location'
  | 'voice-call-incoming'
  | 'voice-call-outgoing'
  | 'voice-call-missed'
  | 'voice-call-rejected'
  | 'video-call-incoming'
  | 'video-call-outgoing'
  | 'video-call-missed'
  | 'video-call-rejected';
