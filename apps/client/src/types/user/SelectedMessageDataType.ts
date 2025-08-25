import { ContentType } from '@bro/shared';

export type SelectedMessageData = {
  _id: string;
  MessageType: ContentType;
  message: string;
  mediaUrl?: string | null;
  forwardLabel: boolean;
  canDeleteForEveryone: boolean;
};