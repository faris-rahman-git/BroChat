import api from '@client/configs/axios';
import { DeleteMessageType } from '@bro/shared';
const MESSAGE_API = '/user/message';

export const getPrevMessageApi = async (conversationId: string) => {
  const res = await api.get(MESSAGE_API + '/prevmessage/' + conversationId);
  return res.data;
};

export const deleteMessageApi = async ({
  messageIds,
  conversationId,
  type,
}: {
  messageIds: string[];
  conversationId: string;
  type: DeleteMessageType;
}) => {
  const res = await api.patch(
    MESSAGE_API + '/deletemessage/' + conversationId,
    { type, messageIds }
  );
  return res.data;
};

export const addReactionApi = async ({
  messageId,
  emoji,
  conversationId,
}: {
  messageId: string;
  emoji: string;
  conversationId: string;
}) => {
  const res = await api.post(MESSAGE_API + '/addreaction', {
    messageId,
    emoji,
    conversationId,
  });
  return res.data;
};

export const removeReactionApi = async ({
  messageId,
  conversationId,
}: {
  messageId: string;
  conversationId: string;
}) => {
  const res = await api.delete(
    MESSAGE_API + '/removereaction/' + conversationId + '/' + messageId
  );
  return res.data;
};
