import api from '@client/configs/axios';
import { DeleteMessageType } from '@bro/shared';
const MESSAGE_API = '/user/message';

export const getPrevMessageApi = async (conversationId: string) => {
  const res = await api.get(MESSAGE_API + '/prevmessage/' + conversationId);
  return res.data;
};

export const deleteMessageApi = async ({
  messageId,
  conversationId,
  type,
}: {
  messageId: string;
  conversationId: string;
  type: DeleteMessageType;
}) => {
  const res = await api.delete(
    MESSAGE_API + '/deletemessage/' + conversationId + '/' + messageId,
    {
      params: { type },
    }
  );
  return res.data;
};
