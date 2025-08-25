import { ContentType } from '@bro/shared';
export type ForwardData = {
  MessageType: ContentType;
  message: string;
  mediaUrl?: string | null;
  forwardLabel: boolean;
};

export type ForwardTarget = {
  id: string;
  name: string;
  avatar?: string | null;
  username?: string;
  isGroup: boolean;
};